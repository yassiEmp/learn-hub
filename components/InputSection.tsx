"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImportTabs } from '@/features/content-import/components/ImportTabs';
import { CREATE_STEPS, CreateState, useCreateCourse } from '@/features/course/hooks/useCreateCourse';

const StepList: React.FC<{ state: Exclude<CreateState, { phase: 'idle' }> }> = ({ state }) => {
  const activeIdx = CREATE_STEPS.findIndex((s) => s.id === state.step);
  return (
    <ol className="space-y-3">
      {CREATE_STEPS.map((step, idx) => {
        const done = idx < activeIdx;
        const current = idx === activeIdx;
        const failed = current && state.phase === 'error';
        return (
          <li key={step.id} className="flex items-center gap-3">
            <span
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full border text-xs shrink-0',
                done && 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
                current && !failed && 'border-foreground/40 text-foreground',
                failed && 'bg-red-500/15 border-red-500/40 text-red-400',
                !done && !current && 'border-foreground/10 text-muted-foreground'
              )}
            >
              {done ? (
                <Check className="w-4 h-4" />
              ) : failed ? (
                <AlertCircle className="w-4 h-4" />
              ) : current ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                idx + 1
              )}
            </span>
            <span
              className={cn(
                'text-sm',
                current ? 'text-foreground font-medium' : done ? 'text-foreground/70' : 'text-muted-foreground'
              )}
            >
              {step.label}
              {current && !failed && '…'}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

/** The whole create flow: pick a source, submit, watch progress, retry on failure. */
const InputSection: React.FC = () => {
  const { state, start, retry, reset, isRunning } = useCreateCourse();

  return (
    <div className="w-full space-y-6">
      <ImportTabs disabled={isRunning} onSubmit={start} />

      <AnimatePresence>
        {state.phase !== 'idle' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            aria-live="polite"
            className={cn(
              'p-5 sm:p-6 rounded-2xl border backdrop-blur-xl',
              state.phase === 'error' ? 'border-red-500/30 bg-red-500/5' : 'border-foreground/10 bg-background/60'
            )}
          >
            <StepList state={state} />
            {state.phase === 'running' && (
              <p className="mt-4 text-xs text-muted-foreground">
                This usually takes under a minute. Lessons keep generating on the course page.
              </p>
            )}
            {state.phase === 'error' && (
              <div className="mt-5 space-y-4">
                <p role="alert" className="text-sm text-red-400">
                  {state.message}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={retry}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-4 py-2 rounded-lg border border-foreground/15 text-sm text-foreground hover:bg-foreground/5"
                  >
                    Change my input
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputSection;
