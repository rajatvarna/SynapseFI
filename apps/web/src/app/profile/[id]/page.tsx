'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Profile {
  id: number;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  profilePictureUrl: string | null;
  followers: any[];
  following: any[];
}

export default function PublicProfilePage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const fetchProfile = useCallback(async () => {
    if (!token || !id) return;
    try {
      const res = await fetch(`http://localhost:3003/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const profileData = await res.json();
        setProfile(profileData);
      } else {
        setError('Failed to fetch profile');
      }
    } catch (err) {
      setError('An error occurred');
    }
  }, [id, token]);

  const checkFollowingStatus = useCallback(async () => {
    if (!token || !user) return;
    try {
        const res = await fetch(`http://localhost:3003/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            const myProfile = await res.json();
            const isFollowing = myProfile.following.some((p: any) => p.id === parseInt(id as string));
            setIsFollowing(isFollowing);
        }
    } catch (err) {
        console.error("Failed to check following status", err);
    }
  }, [token, user, id]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
    checkFollowingStatus();
  }, [token, router, fetchProfile, checkFollowingStatus]);

  const handleFollow = async () => {
    if (!token) return;
    try {
      await fetch(`http://localhost:3003/profile/${id}/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProfile();
      checkFollowingStatus();
    } catch (err) {
      setError('An error occurred while following');
    }
  };

  const handleUnfollow = async () => {
    if (!token) return;
    try {
      await fetch(`http://localhost:3003/profile/${id}/unfollow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProfile();
      checkFollowingStatus();
    } catch (err) {
      setError('An error occurred while unfollowing');
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
      <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}'s Profile</h1>
      {profile.profilePictureUrl && (
        <img src={profile.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full my-4" />
      )}
      <div className="flex gap-4 my-4">
        <p>Followers: {profile.followers.length}</p>
        <p>Following: {profile.following.length}</p>
      </div>
      {user?.id !== profile.id.toString() && (
        isFollowing ? (
            <Button variant="secondary" onClick={handleUnfollow}>Unfollow</Button>
        ) : (
            <Button onClick={handleFollow}>Follow</Button>
        )
      )}
    </div>
  );
}
