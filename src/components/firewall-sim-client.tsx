'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Rule, Packet, ParsedRule, SimulationLog, AnimatingPacket } from '@/lib/types';
import { parseRule, generateRandomPacket, simulatePacket } from '@/lib/firewall';
import { RulePanel } from '@/components/rule-panel';
import { SimulationPanel } from '@/components/simulation-panel';
import { useToast } from '@/hooks/use-toast';

const defaultRules = [
    'PERMITIR TCP de CUALQUIERA:CUALQUIERA a CUALQUIERA:443',
    'PERMITIR TCP de CUALQUIERA:CUALQUIERA a CUALQUIERA:80',
    'BLOQUEAR ICMP de CUALQUIERA:CUALQUIERA a CUALQUIERA:CUALQUIERA',
];

export function FirewallSimClient() {
  const [rules, setRules] = useState<Rule[]>(defaultRules.map(r => ({id: crypto.randomUUID(), value: r})));
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<SimulationLog[]>([]);
  const [animatingPackets, setAnimatingPackets] = useState<AnimatingPacket[]>([]);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const parsedRules = useMemo(() => {
    return rules.map(rule => parseRule(rule)).filter((r): r is ParsedRule => r !== null);
  }, [rules]);

  const invalidRulesCount = rules.length - parsedRules.length;

  const handleAddRule = (ruleValue: string) => {
    setRules(prev => [...prev, { id: crypto.randomUUID(), value: ruleValue }]);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const stats = useMemo(() => {
    const allowed = simulationLog.filter(log => log.result === 'PERMITIDO').length;
    const blocked = simulationLog.filter(log => log.result === 'BLOQUEADO').length;
    return { allowed, blocked, total: simulationLog.length };
  }, [simulationLog]);

  const processPacket = useCallback(() => {
    const packet = generateRandomPacket();
    const { result, ruleId } = simulatePacket(packet, parsedRules);

    setSimulationLog(prev => [{ packet, result, ruleId, timestamp: Date.now() }, ...prev.slice(0, 99)]);
    
    const newAnimatingPacket: AnimatingPacket = {
      packet,
      x: 15,
      y: Math.random() * 80 + 10,
      status: 'EN_TRANSITO',
    };
    setAnimatingPackets(prev => [...prev, newAnimatingPacket]);

    // Animate packet
    setTimeout(() => {
        setAnimatingPackets(prev => prev.map(p => p.packet.id === packet.id ? {...p, x: 50} : p));
    }, 100);

    setTimeout(() => {
        setAnimatingPackets(prev => prev.map(p => {
            if (p.packet.id === packet.id) {
                return {...p, x: result === 'PERMITIDO' ? 85 : 50, status: result === 'PERMITIDO' ? 'PERMITIDO' : 'BLOQUEADO' };
            }
            return p;
        }));
    }, 1100);

    // Remove packet after animation
    setTimeout(() => {
        setAnimatingPackets(prev => prev.filter(p => p.packet.id !== packet.id));
    }, 2100);

  }, [parsedRules]);

  const handleStart = () => {
    if(parsedRules.length === 0 && invalidRulesCount === 0) {
        toast({
            variant: "destructive",
            title: "Sin Reglas",
            description: "Añade al menos una regla antes de iniciar la simulación.",
        });
        return;
    }
    setIsSimulating(true);
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    simulationIntervalRef.current = setInterval(processPacket, 700);
  };

  const handlePause = () => {
    setIsSimulating(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const handleReset = () => {
    handlePause();
    setSimulationLog([]);
    setAnimatingPackets([]);
  };
  
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full h-full items-start">
      <div className="lg:col-span-2 h-full">
        <RulePanel
          rules={rules}
          onAddRule={handleAddRule}
          onDeleteRule={handleDeleteRule}
          parsedRulesCount={parsedRules.length}
          invalidRulesCount={invalidRulesCount}
        />
      </div>
      <div className="lg:col-span-3 h-full">
        <SimulationPanel
          rules={rules}
          parsedRules={parsedRules}
          isSimulating={isSimulating}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          animatingPackets={animatingPackets}
          simulationLog={simulationLog}
          stats={stats}
        />
      </div>
    </div>
  );
}
