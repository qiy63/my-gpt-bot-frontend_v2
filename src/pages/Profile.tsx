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
  "w-full pr-4 pl-2 py-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-indigo-950 placeholder:text-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-indigo-50 transition-all duration-200 leading-relaxed";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl bg-indigo-100/70 hover:bg-indigo-200/70 transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-indigo-900" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                    {profile.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-indigo-950 text-lg font-semibold">{profile.full_name || "Your name"}</p>
                    <p className="text-indigo-700/80 text-sm">{profile.email || "No email found"}</p>
                  </div>
                </div>
              </div>

              <label
                htmlFor="profile-picture-input"
                className="p-3 rounded-xl bg-indigo-100/70 hover:bg-indigo-200/70 transition-all duration-200 cursor-pointer flex items-center gap-2 text-indigo-900"
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

        <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl p-6 md:p-8 shadow-sm">
          {error && (
            <p className="mb-4 text-center text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl py-2">
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
              <p className="text-indigo-700/80 text-sm flex-1">
                Your details help us personalise your legal experience. All data is encrypted and
                stored securely.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
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
      <label className="block text-indigo-900/80 mb-2 text-sm">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </span>
        <div className="pl-12">{children}</div>
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
