
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Pencil, Trash, Plus, X, Clock, Users, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { v4 as uuidv4 } from 'uuid';

interface Tournament {
  id: string;
  tournamentName: string;
  entryFee: number;
  tournamentType: 'Solo' | 'Duo' | 'Squad';
  startDateTime: string;
  maxTeams: number;
  status: 'Open' | 'Closed';
  description: string;
  bannerImageURL: string;
}

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    tournamentName: '',
    entryFee: 0,
    tournamentType: 'Squad' as 'Solo' | 'Duo' | 'Squad',
    startDateTime: '',
    maxTeams: 25,
    status: 'Open' as 'Open' | 'Closed',
    description: '',
    bannerImageURL: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const tournamentCollection = collection(db, 'tournaments');
      const tournamentSnapshot = await getDocs(tournamentCollection);
      const tournamentList = tournamentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Tournament[];
      setTournaments(tournamentList);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to load tournaments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'entryFee' || name === 'maxTeams' ? Number(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const uploadBanner = async (): Promise<string> => {
    if (!bannerImage) {
      return currentTournament?.bannerImageURL || '';
    }

    const storageRef = ref(storage, `tournament-banners/${uuidv4()}`);
    await uploadBytes(storageRef, bannerImage);
    return await getDownloadURL(storageRef);
  };

  const handleAddEditTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let bannerURL = formData.bannerImageURL;
      
      if (bannerImage) {
        bannerURL = await uploadBanner();
      }

      const tournamentData = {
        ...formData,
        bannerImageURL: bannerURL,
      };

      if (currentTournament) {
        // Update existing tournament
        await setDoc(doc(db, 'tournaments', currentTournament.id), tournamentData);
        toast({
          title: "Success",
          description: "Tournament updated successfully!",
        });
      } else {
        // Add new tournament
        await addDoc(collection(db, 'tournaments'), tournamentData);
        toast({
          title: "Success",
          description: "Tournament created successfully!",
        });
      }

      setIsDialogOpen(false);
      clearForm();
      fetchTournaments();
    } catch (error) {
      console.error("Error saving tournament:", error);
      toast({
        title: "Error",
        description: "Failed to save tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async () => {
    if (!currentTournament) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'tournaments', currentTournament.id));
      setIsDeleteDialogOpen(false);
      setCurrentTournament(null);
      
      toast({
        title: "Success",
        description: "Tournament deleted successfully!",
      });
      
      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast({
        title: "Error",
        description: "Failed to delete tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    clearForm();
    setCurrentTournament(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setFormData({
      tournamentName: tournament.tournamentName,
      entryFee: tournament.entryFee,
      tournamentType: tournament.tournamentType,
      startDateTime: tournament.startDateTime,
      maxTeams: tournament.maxTeams,
      status: tournament.status,
      description: tournament.description,
      bannerImageURL: tournament.bannerImageURL,
    });
    setBannerPreview(tournament.bannerImageURL);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setIsDeleteDialogOpen(true);
  };

  const clearForm = () => {
    setFormData({
      tournamentName: '',
      entryFee: 0,
      tournamentType: 'Squad',
      startDateTime: '',
      maxTeams: 25,
      status: 'Open',
      description: '',
      bannerImageURL: '',
    });
    setBannerImage(null);
    setBannerPreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <Button className="gaming-button flex items-center gap-2" onClick={openAddDialog}>
          <Plus size={16} />
          Add Tournament
        </Button>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-400 mb-4">No tournaments created yet.</p>
          <Button className="gaming-button-secondary" onClick={openAddDialog}>
            Create your first tournament
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="gaming-card overflow-hidden">
              <div className="relative h-48">
                <img
                  src={tournament.bannerImageURL || "https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/ce405ad07404fecfb3196b77822aec8b.jpg"}
                  alt={tournament.tournamentName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gaming-dark/80 border-gaming-orange/30 hover:bg-gaming-orange/60"
                    onClick={() => openEditDialog(tournament)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gaming-dark/80 border-red-500/30 hover:bg-red-500/60"
                    onClick={() => openDeleteDialog(tournament)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <span className={`
                  absolute bottom-4 left-4 px-3 py-1 text-xs font-bold rounded-full
                  ${tournament.status === 'Open' ? 'bg-green-500' : 'bg-gray-500'}
                `}>
                  {tournament.status}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tournament.tournamentName}</h3>
                
                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar size={16} className="text-gaming-orange" />
                    <span>{new Date(tournament.startDateTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock size={16} className="text-gaming-orange" />
                    <span>{new Date(tournament.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users size={16} className="text-gaming-orange" />
                    <span>{tournament.tournamentType}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1">
                    <DollarSign size={18} className="text-gaming-orange" />
                    <span className="font-bold text-white">₹{tournament.entryFee}</span>
                    <span className="text-gray-400 text-sm">Entry Fee</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-sm">Max Teams:</span>
                    <span className="ml-1 font-bold text-white">{tournament.maxTeams}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-2">{tournament.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Tournament Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-gaming-darker text-white border-gaming-orange/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {currentTournament ? 'Edit Tournament' : 'Add Tournament'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentTournament 
                ? 'Update tournament details below.' 
                : 'Fill in the details to create a new tournament.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEditTournament} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tournamentName" className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament Name
                </label>
                <Input
                  id="tournamentName"
                  name="tournamentName"
                  value={formData.tournamentName}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="entryFee" className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Fee (₹)
                </label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="tournamentType" className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament Type
                </label>
                <Select 
                  value={formData.tournamentType} 
                  onValueChange={(value) => handleSelectChange('tournamentType', value)}
                >
                  <SelectTrigger className="bg-gaming-dark border-gaming-orange/30 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gaming-dark border-gaming-orange/30 text-white">
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Duo">Duo</SelectItem>
                    <SelectItem value="Squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date & Time
                </label>
                <Input
                  id="startDateTime"
                  name="startDateTime"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-300 mb-1">
                  Maximum Teams
                </label>
                <Input
                  id="maxTeams"
                  name="maxTeams"
                  type="number"
                  min="1"
                  value={formData.maxTeams}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value as 'Open' | 'Closed')}
                >
                  <SelectTrigger className="bg-gaming-dark border-gaming-orange/30 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gaming-dark border-gaming-orange/30 text-white">
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gaming-dark border-gaming-orange/30 text-white h-24"
                required
              />
            </div>

            <div>
              <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-300 mb-1">
                Tournament Banner
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  {bannerPreview && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img 
                          src={bannerPreview} 
                          alt="Banner preview" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="bg-gaming-dark border-gaming-orange/30 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Recommended size: 1280x720 pixels. Max size: 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="gaming-button"
                disabled={loading}
              >
                {loading ? "Saving..." : currentTournament ? "Update Tournament" : "Create Tournament"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gaming-darker text-white border-gaming-orange/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete {currentTournament?.tournamentName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteTournament}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Tournament"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTournaments;
