import type { Rule, Packet, ParsedRule, PacketProtocol } from './types';

// Regex más flexible para analizar las reglas, compatible con mayúsculas y minúsculas.
const RULE_REGEX = /^(PERMITIR|BLOQUEAR)\s+(TCP|UDP|ICMP|CUALQUIERA)\s+de\s+([a-zA-Z0-9\.:]+|CUALQUIERA):([a-zA-Z0-9]+|CUALQUIERA)\s+a\s+([a-zA-Z0-9\.:]+|CUALQUIERA):([a-zA-Z0-9]+|CUALQUIERA)$/i;

export const parseRule = (rule: Rule): ParsedRule | null => {
  const match = rule.value.trim().match(RULE_REGEX);
  if (!match) return null;

  const [, action, protocol, sourceIp, sourcePort, destIp, destPort] = match;

  // Corregir la acción para que siempre sea mayúscula, ej: BLOQUEAR
  const validatedAction = action.toUpperCase() as 'PERMITIR' | 'BLOQUEAR';

  return {
    id: rule.id,
    value: rule.value,
    action: validatedAction,
    protocol: protocol.toUpperCase() as PacketProtocol,
    sourceIp: sourceIp.toUpperCase(),
    sourcePort: sourcePort.toUpperCase() === 'CUALQUIERA' ? 'CUALQUIERA' : parseInt(sourcePort, 10),
    destIp: destIp.toUpperCase(),
    destPort: destPort.toUpperCase() === 'CUALQUIERA' ? 'CUALQUIERA' : parseInt(destPort, 10),
  };
};

// --- EXPLICACIÓN DE LA GENERACIÓN DE PAQUETES ---
// Esta función crea un paquete de red simulado con valores aleatorios.
// El objetivo es generar tráfico variado para probar tus reglas de firewall.
export const generateRandomPacket = (): Packet => {
  // 1. SELECCIONA UN PROTOCOLO AL AZAR
  // Elige entre los 3 tipos de tráfico más comunes.
  const protocols: ('TCP' | 'UDP' | 'ICMP')[] = ['TCP', 'UDP', 'ICMP'];
  const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)];

  // 2. GENERA UNA DIRECCIÓN IP ALEATORIA
  // Simula IPs de redes comunes (como las de una casa u oficina) para hacerlo más realista.
  const randomIp = () => {
    const segments = [
      Math.random() > 0.5 ? '192.168.1' : '10.0.0', // Simula IPs de redes privadas comunes
      Math.floor(Math.random() * 254) + 1
    ];
    return segments.join('.');
  };

  // 3. GENERA UN PUERTO ALEATORIO
  // A veces usa puertos muy conocidos (80, 443) y otras veces uno cualquiera,
  // tal como ocurre en el tráfico real de internet.
  const randomPort = () => {
      const commonPorts = [80, 443, 53, 22, 21, 8080]; // Puertos para web, DNS, SSH, etc.
      if (Math.random() > 0.7) { // 30% de probabilidad de usar un puerto común
          return commonPorts[Math.floor(Math.random() * commonPorts.length)];
      }
      return Math.floor(Math.random() * 65535) + 1; // El resto de las veces, un puerto cualquiera
  };

  // 4. CONSTRUYE Y DEVUELVE EL PAQUETE FINAL
  // Este objeto "Packet" es el que se pasará al firewall para ser evaluado.
  return {
    id: crypto.randomUUID(),
    protocol: randomProtocol,
    sourceIp: randomIp(),
    sourcePort: randomPort(),
    destIp: randomIp(),
    destPort: randomPort(),
  };
};

export const simulatePacket = (packet: Packet, rules: ParsedRule[]): { result: 'PERMITIDO' | 'BLOQUEADO'; ruleId: string | 'default' } => {
  for (const rule of rules) {
    const protocolMatch = rule.protocol === 'CUALQUIERA' || rule.protocol === packet.protocol;
    const sourceIpMatch = rule.sourceIp === 'CUALQUIERA' || rule.sourceIp === packet.sourceIp;
    const sourcePortMatch = rule.sourcePort === 'CUALQUIERA' || rule.sourcePort === packet.sourcePort;
    const destIpMatch = rule.destIp === 'CUALQUIERA' || rule.destIp === packet.destIp;
    const destPortMatch = rule.destPort === 'CUALQUIERA' || rule.destPort === packet.destPort;

    if (protocolMatch && sourceIpMatch && sourcePortMatch && destIpMatch && destPortMatch) {
      // Si el paquete coincide con todos los campos de la regla, se aplica la acción y se detiene la evaluación.
      return { result: rule.action === 'PERMITIR' ? 'PERMITIDO' : 'BLOQUEADO', ruleId: rule.id };
    }
  }

  // Política de denegación implícita: si el paquete no coincidió con NINGUNA regla, se bloquea.
  return { result: 'BLOQUEADO', ruleId: 'default' };
};
