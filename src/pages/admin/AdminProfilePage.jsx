import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { UserCog, Mail, ShieldCheck, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";

const AdminProfilePage = () => {
  const { user } = useAuthStore();

  // Create a placeholder for the join date for demonstration
  // In a real app, you'd get this from user.createdAt
  const joinDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "October 11, 2025";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <Card.Content>
              {/* Profile Avatar */}
              <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <UserCog className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="mt-3 inline-block bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                {user?.role}
              </span>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-800">
                Administrator Details
              </h2>
            </Card.Header>
            <Card.Content>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Email Address
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900">{user?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Role
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-indigo-600 uppercase">
                    {user?.role}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Member Since
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900">{joinDate}</dd>
                </div>
              </dl>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
