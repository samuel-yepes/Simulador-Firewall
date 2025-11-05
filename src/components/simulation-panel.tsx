'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Shield, ShieldCheck, ShieldX, Server, Globe, Mail, ChevronRight } from 'lucide-react';
import type { AnimatingPacket, SimulationLog, Rule, ParsedRule } from '@/lib/types';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface SimulationPanelProps {
  rules: Rule[];
  parsedRules: ParsedRule[];
  isSimulating: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  animatingPackets: AnimatingPacket[];
  simulationLog: SimulationLog[];
  stats: { allowed: number; blocked: number; total: number };
}

export function SimulationPanel({
  rules,
  parsedRules,
  isSimulating,
  onStart,
  onPause,
  onReset,
  animatingPackets,
  simulationLog,
  stats,
}: SimulationPanelProps) {

  const getRuleValueById = (id: string) => {
    if (id === 'default') return 'Política por Defecto (Bloquear)';
    const rule = rules.find(r => r.id === id);
    if (!rule) return 'Regla Desconocida';
    const index = rules.findIndex(r => r.id === id);
    return `Regla #${index + 1}: ${rule.value}`;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>2. Inicia la Simulación</CardTitle>
        <CardDescription>
          Visualiza el tráfico de red y ve tus reglas en acción. Los paquetes (mensajes) se generan aleatoriamente desde un 'Origen' y viajan hacia el 'Destino', pasando por tu firewall.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {!isSimulating ? (
            <Button onClick={onStart} className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-4 w-4" /> Iniciar Simulación
            </Button>
          ) : (
            <Button onClick={onPause} variant="secondary">
              <Pause className="mr-2 h-4 w-4" /> Pausar Simulación
            </Button>
          )}
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
          </Button>
        </div>

        {/* Visualization Area */}
        <div className="relative w-full h-[400px] bg-secondary/30 rounded-lg border-2 border-dashed overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 items-center">
            <div className="flex flex-col items-center"><Globe className="h-10 w-10 text-muted-foreground"/><span className="text-sm font-bold text-muted-foreground mt-2">Origen </span></div>
            <div className="flex flex-col items-center"><Shield className="h-12 w-12 text-primary"/><span className="text-sm font-bold text-muted-foreground mt-2">Firewall</span></div>
            <div className="flex flex-col items-center"><Server className="h-10 w-10 text-muted-foreground"/><span className="text-sm font-bold text-muted-foreground mt-2">Destino </span></div>
          </div>
          {animatingPackets.map(p => (
            <div key={p.packet.id}
                 className="absolute top-0 transition-all duration-1000 ease-linear"
                 style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <Mail className={`h-6 w-6 ${p.status === 'PERMITIDO' ? 'text-green-500' : p.status === 'BLOQUEADO' ? 'text-red-500' : 'text-primary'}`}/>
            </div>
          ))}
        </div>

        {/* Reports Area */}
        <Tabs defaultValue="stats" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                <TabsTrigger value="log">Registro de Tráfico</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-4 flex-grow">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paquetes Totales</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permitidos</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-green-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.allowed}</div>
                            <p className="text-xs text-muted-foreground">{stats.total > 0 ? `${((stats.allowed / stats.total) * 100).toFixed(1)}%` : '0%'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
                            <ShieldX className="h-4 w-4 text-red-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.blocked}</div>
                            <p className="text-xs text-muted-foreground">{stats.total > 0 ? `${((stats.blocked / stats.total) * 100).toFixed(1)}%` : '0%'}</p>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="log" className="mt-2 flex-grow">
                <ScrollArea className="h-64 border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Paquete</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Regla Aplicada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {simulationLog.map(log => (
                                <TableRow key={log.timestamp}>
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex items-center">
                                            <span>{log.packet.sourceIp}:{log.packet.sourcePort}</span>
                                            <ChevronRight className="h-4 w-4 mx-1"/>
                                            <span>{log.packet.destIp}:{log.packet.destPort}</span>
                                            <Badge variant="outline" className="ml-2">{log.packet.protocol}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={log.result === 'PERMITIDO' ? 'default' : 'destructive'} className={log.result === 'PERMITIDO' ? 'bg-green-600' : ''}>{log.result}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs truncate max-w-xs">{getRuleValueById(log.ruleId)}</TableCell>
                                 </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {simulationLog.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">El registro de la simulación está vacío.</p>}
                </ScrollArea>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
