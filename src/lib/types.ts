export type Rule = {
  id: string;
  value: string;
};

export type PacketProtocol = 'TCP' | 'UDP' | 'ICMP' | 'CUALQUIERA';
export type RuleAction = 'PERMITIR' | 'BLOQUEAR';

export type ParsedRule = {
  id: string;
  value: string;
  action: RuleAction;
  protocol: PacketProtocol;
  sourceIp: string;
  sourcePort: number | 'CUALQUIERA';
  destIp: string;
  destPort: number | 'CUALQUIERA';
};

export type Packet = {
  id: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
};

export type SimulationLog = {
  packet: Packet;
  result: 'PERMITIDO' | 'BLOQUEADO';
  ruleId: string | 'default';
  timestamp: number;
};

export type AnimatingPacket = {
  packet: Packet;
  x: number;
  y: number;
  status: 'EN_TRANSITO' | 'PERMITIDO' | 'BLOQUEADO';
  matchedRuleId?: string;
};
