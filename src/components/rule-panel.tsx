'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import type { Rule } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface RulePanelProps {
  rules: Rule[];
  onAddRule: (ruleValue: string) => void;
  onDeleteRule: (ruleId: string) => void;
  parsedRulesCount: number;
  invalidRulesCount: number;
}

const exampleRules = [
    'PERMITIR TCP de CUALQUIERA:CUALQUIERA a 192.168.1.100:80',
    'BLOQUEAR UDP de 10.0.0.5:CUALQUIERA a CUALQUIERA:53',
    'PERMITIR ICMP de CUALQUIERA:CUALQUIERA a CUALQUIERA:CUALQUIERA',
];

export function RulePanel({
  rules,
  onAddRule,
  onDeleteRule,
  parsedRulesCount,
  invalidRulesCount
}: RulePanelProps) {
  const [newRule, setNewRule] = useState('');
  const { toast } = useToast();

  const handleAddRule = () => {
    if (newRule.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La regla no puede estar vacía.",
      });
      return;
    }
    onAddRule(newRule.toUpperCase());
    setNewRule('');
  };

  const addExampleRule = (rule: string) => {
    setNewRule(rule);
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Paso 1: Define tus Reglas</CardTitle>
        <CardDescription>
            Actualmente tienes <strong>{parsedRulesCount}</strong> reglas válidas y <strong>{invalidRulesCount}</strong> inválidas.
            Las reglas se procesan en orden de arriba hacia abajo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>¿Cómo funcionan las reglas?</AlertTitle>
          <AlertDescription>
            <p>Cada paquete se compara con tus reglas en orden. La primera regla que coincida decide si el paquete es <strong>PERMITIDO</strong> o <strong>BLOQUEADO</strong>.</p>
            <br/>
            <p><strong className="text-destructive">Importante:</strong> Si un paquete no coincide con NINGUNA de tus reglas, será <strong>BLOQUEADO</strong> por defecto. Esta es la &quot;política de denegación implícita&quot;, un principio fundamental de los firewalls seguros.</p>
          </AlertDescription>
        </Alert>
        <div className="space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Usa el formato: <strong>ACCIÓN PROTOCOLO de IP_ORIGEN:PUERTO a IP_DESTINO:PUERTO</strong>. <br/>
            Usa <strong>CUALQUIERA</strong> como comodín para IP o Puerto.
          </p>
          <Textarea
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Ej: PERMITIR TCP de CUALQUIERA:CUALQUIERA a 192.168.1.100:80"
            className="font-mono text-sm"
          />
           <div className="text-xs text-muted-foreground">
            Sugerencias: {exampleRules.map((r, i) => <button key={i} onClick={() => addExampleRule(r)} className="underline hover:text-primary ml-2">{r.split(' ')[0]} {r.split(' ')[1]}</button>)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleAddRule} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Añadir Regla
          </Button>
        </div>

        <h3 className="font-semibold tracking-tight">Reglas Actuales</h3>
        <ScrollArea className="h-64 flex-grow border rounded-md">
          {rules.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
              No hay reglas definidas. Añade una para empezar.
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {rules.map(({ id, value }, index) => (
                <div key={id} className="flex items-center gap-2 p-2 bg-secondary/80 rounded-md group">
                  <span className='text-muted-foreground font-bold text-xs mr-2'>{index + 1}</span>
                  <span className="font-mono text-sm flex-grow truncate">{value}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-20 group-hover:opacity-100"
                    onClick={() => onDeleteRule(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Borrar regla</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
