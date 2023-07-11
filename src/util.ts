import {PromisifiedBus} from 'i2c-bus';

import {crcCheck, crcCompute} from './crc';

import {SCD30_ADDRESS} from './constants';

export const commandToBuffer = (command: number): Buffer => Buffer.from([command >> 8, command & 0xff]);

export const integerToUint16 = (value: number): Buffer => {
  const buf = Buffer.alloc(2);
  buf.writeUInt16BE(value, 0);
  return buf;
};

export const booleanToUint16 = (value: boolean): Buffer => integerToUint16(value ? 1 : 0);

export const write = async (bus: PromisifiedBus, buf: Buffer): Promise<void> => {
  await bus.i2cWrite(SCD30_ADDRESS, buf.length, buf);
};

export const read = async (bus: PromisifiedBus, length: number): Promise<Buffer> => {
  const buf = Buffer.alloc(length);
  await bus.i2cRead(SCD30_ADDRESS, buf.length, buf);

  const data = crcCheck(buf);

  return data;
};

export const performCommand = async (
  bus: PromisifiedBus,
  command: number,
  commandArgs: Buffer = Buffer.from([])
): Promise<void> => {
  await write(bus, Buffer.concat([commandToBuffer(command), crcCompute(commandArgs)]));
};

export const performCommandAndRead = async (
  bus: PromisifiedBus,
  command: number,
  readLength: number,
  commandArgs: Buffer = Buffer.from([])
): Promise<Buffer> => {
  await performCommand(bus, command, commandArgs);

  return read(bus, readLength);
};
