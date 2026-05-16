// =============================================================
// ETHARA NEXUS - Settings Page
// Profile update form
// =============================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { toast } from "../hooks/useToast";
import api from "../lib/api";
import useAuthStore from "../store/authStore";

const DEPARTMENTS = ["SDE", "QR", "QL", "TASKER", "TPM", "HR", "PL"];

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (user) reset({ fullName: user.fullName, department: user.department });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await api.put("/users/profile", data);
      updateUser(res.data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <Avatar name={user?.fullName} size="xl" />
            <div>
              <p className="font-semibold text-white">{user?.fullName}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.role}</p>
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <input {...register("fullName")} className="input" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
              <select {...register("department")} className="input">
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting} icon={Save}>Save Changes</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
