import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getProfile, updateProfile, type Profile } from "../api/profile";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle picture selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPictureFile(e.target.files[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (pictureFile) formData.append("picture", pictureFile);

      const updated = await updateProfile(formData);
      setProfile(updated);
      setPictureFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile data</p>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input name="full_name" value={profile.full_name || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Phone:</label>
          <input name="phone" value={profile.phone || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={profile.gender || ""} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Birthdate:</label>
          <input type="date" name="birthdate" value={profile.birthdate || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Address:</label>
          <input name="address" value={profile.address || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Occupation:</label>
          <input name="occupation" value={profile.occupation || ""} onChange={handleChange} />
        </div>
        <div>
          <label>National ID:</label>
          <input name="national_id" value={profile.national_id || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {profile.profile_picture_url && (
            <img src={profile.profile_picture_url} alt="Profile" width={100} height={100} />
          )}
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
