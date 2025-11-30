import React, { useState, useEffect } from "react";
import { Trophy, Star, OctagonX } from "lucide-react";
import { achievementsData, categories } from "../constants/achievements";
import Header from "./Header";
import Status from "./Status";

export default function LifeAchievements() {
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [showNotification, setShowNotification] = useState(null);
  const [showError, setShowError] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [platUnlocked, setPlatUnlocked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("unlocked-achievements");
      if (saved) {
        const savedIds = JSON.parse(saved);
        setUnlockedIds(new Set(savedIds));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        const idsArray = Array.from(unlockedIds);
        localStorage.setItem("unlocked-achievements", JSON.stringify(idsArray));
      } catch (error) {
        console.error("Erro ao salvar conquistas:", error);
      }
    }
  }, [unlockedIds, isLoading]);

  useEffect(() => {
    const points = Array.from(unlockedIds).reduce((sum, id) => {
      const achievement = achievementsData.find((a) => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0);
    setTotalPoints(points);
    setLevel(Math.floor(points / 100) + 1);
  }, [unlockedIds]);

  const toggleAchievement = (achievement) => {
    const newUnlocked = new Set(unlockedIds);
    newUnlocked.add(achievement.id);
    setShowNotification(achievement);
    setTimeout(() => setShowNotification(null), 3000);
    setUnlockedIds(newUnlocked);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "bronze":
        return "from-amber-700 to-amber-900";
      case "prata":
        return "from-gray-400 to-gray-600";
      case "ouro":
        return "from-yellow-400 to-yellow-600";
      case "platina":
        return "from-cyan-400 to-blue-600";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  const getTierBorder = (tier) => {
    switch (tier) {
      case "bronze":
        return "border-amber-700";
      case "prata":
        return "border-gray-400";
      case "ouro":
        return "border-yellow-400";
      case "platina":
        return "border-cyan-400";
      default:
        return "border-gray-600";
    }
  };

  const filteredAchievements = achievementsData.filter(
    (a) => selectedCategory === "Todas" || a.category === selectedCategory
  );

  const completionPercentage = Math.round(
    (unlockedIds.size / achievementsData.length) * 100
  );

  const resetProgress = () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita!"
      )
    ) {
      try {
        localStorage.removeItem("unlocked-achievements");
        setUnlockedIds(new Set());
        alert("Progresso resetado com sucesso!");
      } catch (error) {
        console.error("Erro ao resetar progresso:", error);
      }
    }
  };

  const checkPlatinum = () => {
    if (platUnlocked === false) {
      setShowError("A platina é a última");
      setTimeout(() => setShowError(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center">
        <div className="text-white text-2xl">Carregando conquistas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white p-4 md:p-8">
      {/* Notificação */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-300" size={32} />
            <div>
              <p className="font-bold">Conquista Desbloqueada!</p>
              <p className="text-sm">{showNotification.title}</p>
              <p className="text-xs text-green-100">
                +{showNotification.points} pontos
              </p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-red-800 p-4 rounded-lg shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <OctagonX className="text-red-300" size={32} />
            <div>
              <p className="font-bold">Nananinanão!</p>
              <p className="text-sm">{showError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Header />

        {/* Status */}
        <Status
          completionPercentage={completionPercentage}
          level={level}
          totalPoints={totalPoints}
          unlockedIds={unlockedIds}
        />

        {/* Filtro */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={resetProgress}
            className="px-4 py-2 rounded-full bg-red-600/80 hover:bg-red-600 transition-all ml-4"
            title="Resetar todo o progresso"
            hidden={true}
          >
            🔄 Resetar
          </button>
        </div>

        {/* Conquistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                onClick={() =>
                  achievement.tier !== "platina"
                    ? toggleAchievement(achievement)
                    : checkPlatinum()
                }
                className={`
                  relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-300
                  ${
                    isUnlocked
                      ? `bg-gradient-to-br ${getTierColor(
                          achievement.tier
                        )} ${getTierBorder(
                          achievement.tier
                        )} shadow-lg shadow-${
                          achievement.tier === "platina" ? "cyan" : "yellow"
                        }-500/50 scale-105`
                      : "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
                  }
                `}
              >
                {/* Tier Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`
                    px-2 py-1 rounded text-xs font-bold uppercase
                    ${
                      achievement.tier === "bronze" &&
                      "bg-amber-700 text-amber-100"
                    }
                    ${
                      achievement.tier === "prata" &&
                      "bg-gray-400 text-gray-900"
                    }
                    ${
                      achievement.tier === "ouro" &&
                      "bg-yellow-400 text-yellow-900"
                    }
                    ${
                      achievement.tier === "platina" &&
                      "bg-cyan-400 text-cyan-900"
                    }
                  `}
                  >
                    {achievement.tier}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`
                    p-3 rounded-lg
                    ${isUnlocked ? "bg-white/20" : "bg-gray-700/50"}
                  `}
                  >
                    <Icon
                      size={32}
                      className={isUnlocked ? "text-white" : "text-gray-500"}
                    />
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`font-bold mb-1 ${
                        isUnlocked ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p
                      className={`text-sm mb-2 ${
                        isUnlocked ? "text-gray-100" : "text-gray-500"
                      }`}
                    >
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">
                        {achievement.category}
                      </span>
                      <span className="text-xs text-yellow-300 font-bold">
                        {achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                {isUnlocked && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Star
                      className="text-yellow-300 animate-pulse"
                      size={48}
                      opacity={0.3}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
