export interface ZipEntryInput {
  name: string;
  data: Uint8Array;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date: Date): { dosTime: number; dosDate: number } {
  const year = Math.max(1980, date.getFullYear());
  const dosTime =
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    ((date.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((year - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0x0f) << 5) |
    (date.getDate() & 0x1f);
  return { dosTime, dosDate };
}

function deduplicateName(name: string, usedNames: Set<string>): string {
  if (!usedNames.has(name)) {
    usedNames.add(name);
    return name;
  }
  const dotIdx = name.lastIndexOf(".");
  const stem = dotIdx !== -1 ? name.slice(0, dotIdx) : name;
  const ext = dotIdx !== -1 ? name.slice(dotIdx) : "";
  let counter = 2;
  let candidate = `${stem}_${counter}${ext}`;
  while (usedNames.has(candidate)) {
    counter += 1;
    candidate = `${stem}_${counter}${ext}`;
  }
  usedNames.add(candidate);
  return candidate;
}

/** Builds an uncompressed (STORE) standard ZIP archive Blob in memory. */
export function buildZipBlob(entries: ZipEntryInput[]): Blob {
  const encoder = new TextEncoder();
  const { dosTime, dosDate } = getDosDateTime(new Date());
  const usedNames = new Set<string>();

  const prepared = entries.map((entry) => {
    const uniqueName = deduplicateName(entry.name, usedNames);
    const nameBytes = encoder.encode(uniqueName);
    const checksum = crc32(entry.data);
    return {
      nameBytes,
      data: entry.data,
      checksum,
      offset: 0,
    };
  });

  let localTotalSize = 0;
  let centralTotalSize = 0;
  for (const item of prepared) {
    item.offset = localTotalSize;
    localTotalSize += 30 + item.nameBytes.length + item.data.length;
    centralTotalSize += 46 + item.nameBytes.length;
  }

  const totalSize = localTotalSize + centralTotalSize + 22;
  const output = new Uint8Array(totalSize);
  const view = new DataView(output.buffer);

  // Local file headers + file payload
  let cursor = 0;
  for (const item of prepared) {
    view.setUint32(cursor, 0x04034b50, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, 0x0800, true);
    view.setUint16(cursor + 8, 0, true);
    view.setUint16(cursor + 10, dosTime, true);
    view.setUint16(cursor + 12, dosDate, true);
    view.setUint32(cursor + 14, item.checksum, true);
    view.setUint32(cursor + 18, item.data.length, true);
    view.setUint32(cursor + 22, item.data.length, true);
    view.setUint16(cursor + 26, item.nameBytes.length, true);
    view.setUint16(cursor + 28, 0, true);
    output.set(item.nameBytes, cursor + 30);
    cursor += 30 + item.nameBytes.length;
    output.set(item.data, cursor);
    cursor += item.data.length;
  }

  // Central directory headers
  const centralStart = cursor;
  for (const item of prepared) {
    view.setUint32(cursor, 0x02014b50, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, 20, true);
    view.setUint16(cursor + 8, 0x0800, true);
    view.setUint16(cursor + 10, 0, true);
    view.setUint16(cursor + 12, dosTime, true);
    view.setUint16(cursor + 14, dosDate, true);
    view.setUint32(cursor + 16, item.checksum, true);
    view.setUint32(cursor + 20, item.data.length, true);
    view.setUint32(cursor + 24, item.data.length, true);
    view.setUint16(cursor + 28, item.nameBytes.length, true);
    view.setUint16(cursor + 30, 0, true);
    view.setUint16(cursor + 32, 0, true);
    view.setUint16(cursor + 34, 0, true);
    view.setUint16(cursor + 36, 0, true);
    view.setUint32(cursor + 38, 0, true);
    view.setUint32(cursor + 42, item.offset, true);
    output.set(item.nameBytes, cursor + 46);
    cursor += 46 + item.nameBytes.length;
  }

  // End of central directory record
  view.setUint32(cursor, 0x06054b50, true);
  view.setUint16(cursor + 4, 0, true);
  view.setUint16(cursor + 6, 0, true);
  view.setUint16(cursor + 8, prepared.length, true);
  view.setUint16(cursor + 10, prepared.length, true);
  view.setUint32(cursor + 12, centralTotalSize, true);
  view.setUint32(cursor + 16, centralStart, true);
  view.setUint16(cursor + 20, 0, true);

  return new Blob([output], { type: "application/zip" });
}
