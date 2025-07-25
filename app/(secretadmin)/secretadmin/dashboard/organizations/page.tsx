'use client'

import ClusterDashCard from "@/components/ClusterDashCard";
import { useAuth } from "@/hooks/useAuth";
import useFetchData from '@/hooks/useFetchData';
import { ICluster } from "@/types/cluster.types";
import { Button, Card, Loader, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClusterPage() {
  const { user, loading: userLoading } = useAuth();
  const { data, loading, error } = useFetchData(`/api/admin/organizations`);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ abbreviatedName: '', fullName: '' });
  const [clusters, setClusters] = useState<ICluster[]>([]);
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/secretadmin");
    }
  }, [user, loading, router, userLoading]);

  useEffect(() => {
    if (data) {
      setClusters(data);
    }
  }, [data]);

  const handleIconClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/organizations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const result = await response.json();
      notifications.show({
        title: 'Success',
        message: 'Cluster created successfully',
        autoClose: 2000,
        color: 'green',
        position: 'bottom-center',
      });
      setShowForm(false);
      setFormValues({ abbreviatedName: '', fullName: '' });
      setClusters([...clusters, result.data]);
    } catch (err) {
      const error = err as Error;
      notifications.show({
        title: 'Error',
        message: error.message,
        autoClose: 2000,
        color: 'red',
        position: 'bottom-center',
      });
    }
  };

  const handleEditSuccess = (updatedCluster: ICluster) => {
    setClusters(clusters.map(cluster => cluster._id === updatedCluster._id ? updatedCluster : cluster));
  };

  const handleDeleteSuccess = (deletedClusterId: string) => {
    setClusters(clusters.filter(cluster => cluster._id !== deletedClusterId));
  };

  if (error) {
    notifications.show({
      title: 'Error',
      message: error,
      color: 'red',
    });
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 w-full h-screen bg-gradient-to-br from-white to-slate-200 flex flex-wrap justify-center items-center gap-10">
      {loading || globalLoading ? <Loader /> : (
        <>
          {clusters.map((cluster: ICluster) => (
            <ClusterDashCard
              key={cluster._id?.toString()}
              user={user}
              cluster={cluster}
              isEditing={editingClusterId === cluster._id?.toString()}
              setEditingClusterId={setEditingClusterId}
              onEditSuccess={handleEditSuccess}
              onDeleteSuccess={handleDeleteSuccess}
              setGlobalLoading={setGlobalLoading}
            />
          ))}
          <Card shadow="md" radius="md" padding="lg" withBorder className="w-80 h-72 flex justify-center items-center transition ease-in-out duration-200 hover:scale-110 cursor-pointer" >
            {showForm ? (
              <form onSubmit={handleSubmit} className="w-full">
                <IconX onClick={() => setShowForm(false)} className="absolute top-2 left-2 cursor-pointer" style={{ color: 'black' }} />
                <TextInput
                  label="Abbreviated Name"
                  name="abbreviatedName"
                  value={formValues.abbreviatedName}
                  onChange={handleInputChange}
                  required
                />
                <TextInput
                  label="Full Name"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" fullWidth mt="md">
                  Submit
                </Button>
              </form>
            ) : (
              <div className="w-full h-full flex justify-center items-center" onClick={handleIconClick} >
                <IconPlus stroke={2} width={"80"} height={"72"} color="gray" />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
