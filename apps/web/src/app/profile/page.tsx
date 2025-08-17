'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Profile {
  firstName: string | null;
  lastName: string | null;
  balance: number;
  profilePictureUrl: string | null;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3003/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const profileData = await res.json();
          setProfile(profileData);
          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setProfilePictureUrl(profileData.profilePictureUrl || '');
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch('http://localhost:3003/profile/transactions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const transactionsData = await res.json();
                setTransactions(transactionsData);
            } else {
                setError('Failed to fetch transactions');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    fetchProfile();
    fetchTransactions();
  }, [token, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3003/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        alert('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred during update');
    }
  };

  const handlePictureUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3003/profile/picture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePictureUrl }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        alert('Profile picture updated successfully!');
      } else {
        setError('Failed to update profile picture');
      }
    } catch (err) {
      setError('An error occurred during picture update');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      {profile.profilePictureUrl && (
        <img src={profile.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full my-4" />
      )}
      <p>Balance: ${profile.balance.toFixed(2)}</p>

      <form onSubmit={handleUpdate} className="mt-4 space-y-4">
        <div>
          <label className="block">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Profile
        </button>
      </form>

      <form onSubmit={handlePictureUpdate} className="mt-8 space-y-4">
        <div>
          <label className="block">Profile Picture URL</label>
          <input
            type="text"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.png"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Picture
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <table className="w-full mt-4 text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Date</th>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="border-b p-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="border-b p-2">{tx.type}</td>
                <td className="border-b p-2">${tx.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
