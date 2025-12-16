import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  Camera,
  UserCircle2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  IdCard,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, type Profile as ProfileDto } from "../api/profile";

const inputClass =
  "w-full pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(normalizeProfile(data));
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    const { name, value } = e.target;
    const nextValue = name === "gender" ? value.toLowerCase() : value;
    setProfile({ ...profile, [name]: nextValue });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPictureFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      type EditableField =
        | "full_name"
        | "phone"
        | "gender"
        | "birthdate"
        | "address"
        | "occupation"
        | "national_id";

      const editableFields: EditableField[] = [
        "full_name",
        "phone",
        "gender",
        "birthdate",
        "address",
        "occupation",
        "national_id",
      ];

      editableFields.forEach((field) => {
        const value = profile[field] ?? "";
        formData.append(field, typeof value === "string" ? value : String(value));
      });
      if (pictureFile) formData.append("picture", pictureFile);

      await updateProfile(formData);
      const refreshed = await getProfile();
      setProfile(normalizeProfile(refreshed));
      setPictureFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-indigo-900">Loading profile...</p>;
  if (!profile) return <p className="text-center py-10 text-indigo-900">No profile data</p>;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      <BackgroundGlow />

      <div className="relative w-full max-w-5xl">
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <header className="relative bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    {profile.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-white/70" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-lg">{profile.full_name || "Your name"}</p>
                    <p className="text-white/70 text-sm">{profile.email || "No email found"}</p>
                  </div>
                </div>
              </div>

              <label
                htmlFor="profile-picture-input"
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 cursor-pointer flex items-center gap-2 text-white"
              >
                <Camera className="w-5 h-5" />
                <span className="hidden sm:inline">Change Photo</span>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </header>

          <div className="p-8 md:p-12">
            {error && (
              <p className="mb-4 text-center text-sm text-rose-200 bg-white/10 rounded-xl py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileField icon={<UserCircle2 className="w-5 h-5" />} label="Full Name">
                <input
                  name="full_name"
                  value={profile.full_name || ""}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </ProfileField>

              <ProfileField icon={<Mail className="w-5 h-5" />} label="Email Address">
                <input
                  value={profile.email || ""}
                  readOnly
                  className={`${inputClass} opacity-70 cursor-not-allowed`}
                />
              </ProfileField>

              <ProfileField icon={<Phone className="w-5 h-5" />} label="Phone Number">
                <input
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </ProfileField>

              <ProfileField icon={<IdCard className="w-5 h-5" />} label="National ID">
                <input
                  name="national_id"
                  value={profile.national_id || ""}
                  onChange={handleChange}
                  placeholder="Enter your national ID"
                  className={inputClass}
                />
              </ProfileField>

              <ProfileField icon={<Calendar className="w-5 h-5" />} label="Birthdate">
                <input
                  type="date"
                  name="birthdate"
                  value={profile.birthdate || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </ProfileField>

              <ProfileField icon={<Briefcase className="w-5 h-5" />} label="Occupation">
                <input
                  name="occupation"
                  value={profile.occupation || ""}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                  className={inputClass}
                />
              </ProfileField>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ProfileField icon={<UserCircle2 className="w-5 h-5" />} label="Gender">
                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" className="bg-indigo-900">
                    Select
                  </option>
                  <option value="male" className="bg-indigo-900">
                    Male
                  </option>
                  <option value="female" className="bg-indigo-900">
                    Female
                  </option>
                  <option value="other" className="bg-indigo-900">
                    Other
                  </option>
                </select>
              </ProfileField>

              <ProfileField icon={<MapPin className="w-5 h-5" />} label="Address">
                <textarea
                  name="address"
                  rows={3}
                  value={profile.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`${inputClass} resize-none`}
                />
              </ProfileField>
            </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <p className="text-white/70 text-sm flex-1">
                  Your details help us personalise your legal experience. All data is encrypted and
                  stored securely.
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50 border border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Profile;

type ProfileFieldProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
};

function ProfileField({ icon, label, children }: ProfileFieldProps) {
  return (
    <div className="group">
      <label className="block text-white/80 mb-2 text-sm">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors">
          {icon}
        </span>
        <div className="pl-12">{children}</div>
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}

function normalizeProfile(data: ProfileDto): ProfileDto {
  return {
    ...data,
    birthdate:
      data.birthdate && data.birthdate.length > 10
        ? data.birthdate.slice(0, 10)
        : data.birthdate ?? "",
    gender: data.gender ? data.gender.toLowerCase() : "",
  };
}
