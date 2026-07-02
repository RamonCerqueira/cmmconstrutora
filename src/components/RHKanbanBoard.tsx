'use client';

import { motion } from 'framer-motion';

interface RHKanbanBoardProps {
  pipelineStages: any[];
  applications: any[];
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageValue: string) => void;
  onCardClick: (candidate: any) => void;
}

export default function RHKanbanBoard({
  pipelineStages,
  applications,
  onDragStart,
  onDragOver,
  onDrop,
  onCardClick,
}: RHKanbanBoardProps) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-8 pt-2">
      {pipelineStages.map((stage) => {
        const stageApps = applications.filter((app) => app.status === stage.value);
        return (
          <div
            key={stage.value}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage.value)}
            className="flex-shrink-0 w-80 bg-[#131B2E]/40 border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Column Header */}
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-3 mb-4">
                <span className="font-heading font-bold text-white text-sm">{stage.label}</span>
                <span className="w-5.5 h-5.5 rounded-full bg-accent/15 border border-accent/20 text-accent font-heading font-bold text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(200,167,91,0.05)]">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3.5 min-h-[350px] overflow-y-auto max-h-[65vh] pr-1 scrollbar-thin">
                {stageApps.map((app) => (
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, app.id)}
                    onClick={() => onCardClick(app)}
                    key={app.id}
                    className="bg-[#1E293B]/80 border border-white/[0.05] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-accent/40 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 space-y-3 shadow-md text-left"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-heading font-bold text-white text-xs sm:text-sm line-clamp-1">
                        {app.candidate.name}
                      </h4>
                      {/* Match score Badge */}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          app.score >= 80
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : app.score >= 60
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        {app.score}% Match
                      </span>
                    </div>
                    <span className="block text-[10px] font-sans font-semibold text-gray-450 truncate">
                      Vaga: {app.vacancy.title}
                    </span>
                    <div className="flex justify-between items-center text-[9px] text-gray-500 font-sans border-t border-white/[0.03] pt-2">
                      <span>{app.candidate.profile?.city}</span>
                      <span className="font-semibold">
                        {app.candidate.profile?.crea ? 'CREA Ativo' : 'Sem CREA'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
