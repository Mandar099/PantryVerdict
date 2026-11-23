import React, { useState } from 'react';
import { usePantry } from '../../context/PantryContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CULINARY_STAPLES } from '../../data/culinaryData';
import { FoodVisual } from '../common/FoodVisual';
import { X, Bookmark, Plus, Check, Trash2, FolderPlus, ArrowRight } from 'lucide-react';

export const MyPantryDrawer: React.FC = () => {
  const {
    isMyPantryOpen,
    setIsMyPantryOpen,
    favorites,
    toggleFavorite,
    addToComparison,
    isComparing,
    comparedItems,
    setIsComparisonMatrixOpen,
  } = usePantry();

  const { user, saveBoard, deleteBoard } = useAuth();
  const { showToast } = useToast();
  const [boardTitle, setBoardTitle] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  if (!isMyPantryOpen) return null;

  const favoriteStaples = CULINARY_STAPLES.filter(s => favorites.includes(s.id));

  const handleCreateBoard = () => {
    if (boardTitle.trim() && comparedItems.length > 0) {
      saveBoard(boardTitle.trim(), comparedItems.map(i => i.id));
      showToast(`Comparison Board "${boardTitle.trim()}" saved`, 'success');
      setBoardTitle('');
      setIsCreatingBoard(false);
    }
  };

  const handleLoadBoard = (ids: string[]) => {
    let addedCount = 0;
    ids.forEach(id => {
      const match = CULINARY_STAPLES.find(s => s.id === id);
      if (match) {
        addToComparison(match);
        addedCount++;
      }
    });
    showToast(`Loaded ${addedCount} staples into comparison dock`, 'success');
    setIsMyPantryOpen(false);
    setIsComparisonMatrixOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-y-auto hairline-l border-stone-300">
        
        {/* Header */}
        <div className="p-5 bg-white hairline-b flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2D5A27] flex items-center justify-center text-white">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-stone-900 leading-tight">
                My Pantry Workspace
              </h2>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                {favorites.length} Saved Kitchen Essentials
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMyPantryOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Saved Comparison Boards Section */}
          {user && user.savedBoards && user.savedBoards.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                Saved Comparison Boards:
              </span>
              <div className="space-y-2">
                {user.savedBoards.map(board => (
                  <div
                    key={board.id}
                    className="p-3.5 bg-white rounded-xl hairline-border flex items-center justify-between text-xs"
                  >
                    <div className="pr-2">
                      <span className="font-bold text-stone-900 block text-sm">
                        {board.title}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {board.ingredientIds.length} staples • Created {board.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleLoadBoard(board.ingredientIds)}
                        className="px-3 py-1.5 bg-[#2D5A27] text-white rounded-lg font-semibold flex items-center gap-1 hover:bg-emerald-800 transition-colors shadow-sm"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          deleteBoard(board.id);
                          showToast('Board removed', 'info');
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                        title="Delete board"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Dock as Board */}
          {comparedItems.length > 0 && user && (
            <div className="p-3.5 bg-stone-100/90 rounded-xl hairline-border text-xs">
              {!isCreatingBoard ? (
                <button
                  onClick={() => setIsCreatingBoard(true)}
                  className="w-full text-left font-semibold text-[#2D5A27] flex items-center gap-2"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Save active dock ({comparedItems.length} items) as a new board</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <span className="font-semibold text-stone-800 block">Name Comparison Board</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={boardTitle}
                      onChange={e => setBoardTitle(e.target.value)}
                      placeholder="e.g. Daily Frying Oils Audit"
                      className="flex-1 px-3 py-1.5 text-xs bg-white hairline-border rounded-lg outline-none"
                    />
                    <button
                      onClick={handleCreateBoard}
                      className="px-3.5 py-1.5 bg-[#2D5A27] text-white rounded-lg font-semibold text-xs shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsCreatingBoard(false)}
                      className="px-2 py-1 text-stone-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookmarked Favorites List */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
              Bookmarked Staples:
            </span>

            {favoriteStaples.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl hairline-border text-stone-400 text-xs">
                No items saved yet. Click the heart icon on any staple card to pin it here.
              </div>
            ) : (
              <div className="space-y-2.5">
                {favoriteStaples.map(staple => {
                  const comparing = isComparing(staple.id);

                  return (
                    <div
                      key={staple.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white hairline-border text-xs gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100 hairline-border">
                          <FoodVisual
                            id={staple.id}
                            name={staple.name}
                            category={staple.category}
                            imageUrl={staple.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block text-xs leading-snug">
                            {staple.name}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                            {staple.category} • {staple.smokePoint ? `${staple.smokePoint.celsius}°C` : `NOVA ${staple.novaGroup}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const added = addToComparison(staple);
                            if (added) {
                              showToast(`Added ${staple.name} to comparison dock`, 'success');
                            } else {
                              showToast('Comparison dock is full (maximum 4 staples)', 'error');
                            }
                          }}
                          disabled={comparing}
                          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                            comparing
                              ? 'bg-[#2D5A27] text-white'
                              : 'bg-stone-50 hairline-border text-stone-800 hover:bg-stone-100'
                          }`}
                        >
                          {comparing ? (
                            <>
                              <Check className="w-3 h-3 text-white" />
                              <span>In Dock</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Compare</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            toggleFavorite(staple.id);
                            showToast(`Removed ${staple.name} from My Pantry`, 'info');
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white hairline-t flex justify-end shrink-0">
          <button
            onClick={() => setIsMyPantryOpen(false)}
            className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold rounded-xl hover:bg-stone-800"
          >
            Close Pantry
          </button>
        </div>

      </div>
    </div>
  );
};
