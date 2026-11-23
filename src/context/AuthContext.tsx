import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, KitchenDietaryGoal, StoredUserAccount } from '../types/user';
import { generateSalt, hashPassword } from '../services/cryptoService';
import { loadActiveSession, saveActiveSession, loadAllUsers, saveUserAccount } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    displayName: string,
    kitchenGoals: KitchenDietaryGoal[]
  ) => Promise<{ success: boolean; error?: string }>;
  loginCurator: () => void;
  loginDemo: () => void;
  continueAsGuest: () => void;
  logout: () => void;
  updateGoals: (goals: KitchenDietaryGoal[]) => void;
  saveBoard: (title: string, ingredientIds: string[]) => void;
  deleteBoard: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => loadActiveSession());

  useEffect(() => {
    saveActiveSession(user);
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = loadAllUsers();
    const match = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!match) {
      return { success: false, error: 'No account found matching this email address. Please check your spelling or establish a new profile below.' };
    }

    const testHash = await hashPassword(password, match.salt);
    if (testHash !== match.passwordHash) {
      return { success: false, error: 'The password provided does not match our records. Please verify and try again.' };
    }

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: match.email,
      displayName: match.displayName,
      createdAt: match.createdAt,
      kitchenGoals: match.kitchenGoals || ['heart_health', 'unrefined_only'],
      savedBoards: [
        {
          id: 'board-default',
          title: 'Daily Cooking Oils Audit',
          date: new Date().toLocaleDateString(),
          ingredientIds: ['oil-evoo-cold-pressed', 'oil-groundnut-cold-pressed', 'oil-mustard-kachi-ghani'],
        },
      ],
      customNotes: {},
    };

    setUser(profile);
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    kitchenGoals: KitchenDietaryGoal[]
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = loadAllUsers();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account registered with this email address already exists. Please sign in above.' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const newAccount: StoredUserAccount = {
      email: trimmedEmail,
      displayName: displayName.trim() || 'Culinary Member',
      salt,
      passwordHash,
      kitchenGoals,
      createdAt: new Date().toISOString(),
    };

    saveUserAccount(newAccount);

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: newAccount.email,
      displayName: newAccount.displayName,
      createdAt: newAccount.createdAt,
      kitchenGoals: newAccount.kitchenGoals,
      savedBoards: [
        {
          id: `board-${Date.now()}`,
          title: 'First Kitchen Comparison',
          date: new Date().toLocaleDateString(),
          ingredientIds: ['oil-evoo-cold-pressed', 'ghee-a2-desi-cow-bilona'],
        },
      ],
      customNotes: {},
    };

    setUser(profile);
    return { success: true };
  };

  const loginCurator = () => {
    const curatorUser: UserProfile = {
      id: 'curator-lead',
      email: 'priya.sharma@pantryverdict.org',
      displayName: 'Priya Sharma',
      avatarSeed: 'priya',
      memberTier: 'curator',
      createdAt: new Date().toISOString(),
      kitchenGoals: ['heart_health', 'unrefined_only', 'high_heat_cooking'],
      savedBoards: [
        {
          id: 'board-oils',
          title: 'Daily Cooking Oils Benchmark',
          date: 'Active',
          ingredientIds: ['oil-evoo-cold-pressed', 'oil-mustard-kachi-ghani', 'oil-groundnut-cold-pressed', 'oil-sunflower-refined'],
        },
        {
          id: 'board-sweeteners',
          title: 'Baking & Beverage Sweeteners Audit',
          date: 'Active',
          ingredientIds: ['sweet-raw-unfiltered-honey', 'sweet-jaggery-organic-gur', 'sweet-desi-khand-raw', 'sweet-white-table-sugar'],
        },
      ],
      customNotes: {
        'oil-mustard-kachi-ghani': 'Superb for high-heat wok dishes and traditional tadka. Smoke point: 250°C.',
        'ghee-a2-desi-cow-bilona': 'Pure Bilona-method churned butter; superior butyric acid profile for digestive comfort.',
      },
    };
    setUser(curatorUser);
  };

  // Alias for backward compatibility
  const loginDemo = () => {
    loginCurator();
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      email: 'guest@pantryverdict.org',
      displayName: 'Guest Reader',
      memberTier: 'guest',
      createdAt: new Date().toISOString(),
      kitchenGoals: ['heart_health', 'unrefined_only', 'budget_conscious'],
      savedBoards: [],
      customNotes: {},
    };
    setUser(guestUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateGoals = (goals: KitchenDietaryGoal[]) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, kitchenGoals: goals } : null);
  };

  const saveBoard = (title: string, ingredientIds: string[]) => {
    if (!user) return;
    const newBoard = {
      id: `board-${Date.now()}`,
      title: title || 'Untitled Comparison Board',
      date: new Date().toLocaleDateString(),
      ingredientIds,
    };
    setUser(prev => prev ? {
      ...prev,
      savedBoards: [newBoard, ...prev.savedBoards],
    } : null);
  };

  const deleteBoard = (id: string) => {
    if (!user) return;
    setUser(prev => prev ? {
      ...prev,
      savedBoards: prev.savedBoards.filter(b => b.id !== id),
    } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginCurator,
        loginDemo,
        continueAsGuest,
        logout,
        updateGoals,
        saveBoard,
        deleteBoard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
