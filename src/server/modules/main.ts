import { ServerCore } from '../server';

on('playerConnecting', (name: string, kickReason: string, defferals: any) => {
  const _source = (global as any).source;
  ServerCore.connectPlayer(_source);
});

on('playerDropped', (reason: string) => {
  const _source = (global as any).source;
  ServerCore.disconnectPlayer(_source);
});
