const Status = ({ unlockedIds, totalPoints, level, completionPercentage }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-yellow-400">
            {unlockedIds.size}
          </div>
          <div className="text-sm text-gray-300">Conquistas</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-cyan-400">{totalPoints}</div>
          <div className="text-sm text-gray-300">Pontos</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-400">Nv {level}</div>
          <div className="text-sm text-gray-300">Nível</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-pink-400">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-300">Progresso</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
