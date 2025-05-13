
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash, Plus, Image, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { v4 as uuidv4 } from 'uuid';

interface Champion {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  captainName: string;
  players: { name: string; freeFireUID: string }[];
  heroImageURL: string;
  proofImageURL: string;
  galleryMediaURLs: string[];
}

const AdminChampions = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [tournaments, setTournaments] = useState<{ id: string; tournamentName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentChampion, setCurrentChampion] = useState<Champion | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    tournamentId: '',
    tournamentName: '',
    teamName: '',
    captainName: '',
    players: [
      { name: '', freeFireUID: '' },
      { name: '', freeFireUID: '' },
      { name: '', freeFireUID: '' },
      { name: '', freeFireUID: '' },
    ],
    heroImageURL: '',
    proofImageURL: '',
    galleryMediaURLs: [] as string[],
  });

  useEffect(() => {
    fetchChampions();
    fetchTournaments();
  }, []);

  const fetchChampions = async () => {
    setLoading(true);
    try {
      const championsCollection = collection(db, 'champions');
      const championsSnapshot = await getDocs(championsCollection);
      const championsList = championsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Champion[];
      setChampions(championsList);
    } catch (error) {
      console.error("Error fetching champions:", error);
      toast({
        title: "Error",
        description: "Failed to load champions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      const tournamentsCollection = collection(db, 'tournaments');
      const tournamentsSnapshot = await getDocs(tournamentsCollection);
      const tournamentsList = tournamentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        tournamentName: doc.data().tournamentName,
      }));
      setTournaments(tournamentsList);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTournamentChange = (tournamentId: string) => {
    const selectedTournament = tournaments.find(t => t.id === tournamentId);
    if (selectedTournament) {
      setFormData({
        ...formData,
        tournamentId: tournamentId,
        tournamentName: selectedTournament.tournamentName,
      });
    }
  };

  const handlePlayerChange = (index: number, field: 'name' | 'freeFireUID', value: string) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setFormData({
      ...formData,
      players: updatedPlayers,
    });
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImage(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofImage(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(previews);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleAddEditChampion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let heroURL = formData.heroImageURL;
      let proofURL = formData.proofImageURL;
      let galleryURLs = [...formData.galleryMediaURLs];
      
      if (heroImage) {
        heroURL = await uploadImage(heroImage, 'champion-heroes');
      }
      
      if (proofImage) {
        proofURL = await uploadImage(proofImage, 'champion-proofs');
      }
      
      if (galleryImages.length > 0) {
        const uploadPromises = galleryImages.map(file => 
          uploadImage(file, 'champion-gallery')
        );
        const uploadedURLs = await Promise.all(uploadPromises);
        galleryURLs = [...galleryURLs, ...uploadedURLs];
      }

      const championData = {
        ...formData,
        heroImageURL: heroURL,
        proofImageURL: proofURL,
        galleryMediaURLs: galleryURLs,
      };

      if (currentChampion) {
        // Update existing champion
        await setDoc(doc(db, 'champions', currentChampion.id), championData);
        toast({
          title: "Success",
          description: "Champion updated successfully!",
        });
      } else {
        // Add new champion
        await addDoc(collection(db, 'champions'), championData);
        toast({
          title: "Success",
          description: "Champion created successfully!",
        });
      }

      setIsDialogOpen(false);
      clearForm();
      fetchChampions();
    } catch (error) {
      console.error("Error saving champion:", error);
      toast({
        title: "Error",
        description: "Failed to save champion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChampion = async () => {
    if (!currentChampion) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'champions', currentChampion.id));
      setIsDeleteDialogOpen(false);
      setCurrentChampion(null);
      
      toast({
        title: "Success",
        description: "Champion deleted successfully!",
      });
      
      fetchChampions();
    } catch (error) {
      console.error("Error deleting champion:", error);
      toast({
        title: "Error",
        description: "Failed to delete champion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    clearForm();
    setCurrentChampion(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (champion: Champion) => {
    setCurrentChampion(champion);
    setFormData({
      tournamentId: champion.tournamentId,
      tournamentName: champion.tournamentName,
      teamName: champion.teamName,
      captainName: champion.captainName,
      players: [...champion.players],
      heroImageURL: champion.heroImageURL,
      proofImageURL: champion.proofImageURL,
      galleryMediaURLs: [...champion.galleryMediaURLs],
    });
    setHeroPreview(champion.heroImageURL);
    setProofPreview(champion.proofImageURL);
    setGalleryPreviews([...champion.galleryMediaURLs]);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (champion: Champion) => {
    setCurrentChampion(champion);
    setIsDeleteDialogOpen(true);
  };

  const clearForm = () => {
    setFormData({
      tournamentId: '',
      tournamentName: '',
      teamName: '',
      captainName: '',
      players: [
        { name: '', freeFireUID: '' },
        { name: '', freeFireUID: '' },
        { name: '', freeFireUID: '' },
        { name: '', freeFireUID: '' },
      ],
      heroImageURL: '',
      proofImageURL: '',
      galleryMediaURLs: [],
    });
    setHeroImage(null);
    setProofImage(null);
    setGalleryImages([]);
    setHeroPreview(null);
    setProofPreview(null);
    setGalleryPreviews([]);
  };

  const removeGalleryPreview = (index: number) => {
    if (currentChampion) {
      // For existing champions, remove from the URLs array
      const updatedGalleryURLs = [...formData.galleryMediaURLs];
      updatedGalleryURLs.splice(index, 1);
      setFormData({
        ...formData,
        galleryMediaURLs: updatedGalleryURLs,
      });
      setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    } else {
      // For new champions, remove from the files array
      const updatedGalleryImages = [...galleryImages];
      updatedGalleryImages.splice(index, 1);
      setGalleryImages(updatedGalleryImages);
      
      const updatedPreviews = [...galleryPreviews];
      updatedPreviews.splice(index, 1);
      setGalleryPreviews(updatedPreviews);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Champions</h1>
        <Button className="gaming-button flex items-center gap-2" onClick={openAddDialog}>
          <Plus size={16} />
          Add Champion
        </Button>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading champions...</div>
      ) : champions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-400 mb-4">No champions added yet.</p>
          <Button className="gaming-button-secondary" onClick={openAddDialog}>
            Add your first champion
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {champions.map((champion) => (
            <div key={champion.id} className="gaming-card overflow-hidden">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={champion.heroImageURL || "https://wallpapercave.com/wp/wp11213059.jpg"}
                    alt={champion.teamName}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-gaming-orange" size={20} />
                    <span className="font-bold text-white text-lg">{champion.teamName}</span>
                  </div>
                  <p className="text-gray-200">Captain: {champion.captainName}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gaming-dark/80 border-gaming-orange/30 hover:bg-gaming-orange/60"
                    onClick={() => openEditDialog(champion)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gaming-dark/80 border-red-500/30 hover:bg-red-500/60"
                    onClick={() => openDeleteDialog(champion)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-2">Tournament: {champion.tournamentName}</p>
                <p className="text-sm text-gray-300">Players: {champion.players.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Champion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-gaming-darker text-white border-gaming-orange/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {currentChampion ? 'Edit Champion' : 'Add Champion'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentChampion 
                ? 'Update champion details below.' 
                : 'Fill in the details to add a new champion.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEditChampion} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="tournamentId" className="block text-sm font-medium text-gray-300 mb-1">
                Tournament
              </label>
              <select
                id="tournamentId"
                value={formData.tournamentId}
                onChange={(e) => handleTournamentChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gaming-dark border-gaming-orange/30 text-white"
                required
              >
                <option value="">Select Tournament</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.tournamentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="captainName" className="block text-sm font-medium text-gray-300 mb-1">
                  Captain Name
                </label>
                <Input
                  id="captainName"
                  name="captainName"
                  value={formData.captainName}
                  onChange={handleInputChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Players</h3>
              <div className="space-y-4">
                {formData.players.map((player, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gaming-orange/20 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {index === 0 ? 'Captain Name' : `Player ${index + 1} Name`}
                      </label>
                      <Input
                        value={player.name}
                        onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                        className="bg-gaming-dark border-gaming-orange/30 text-white"
                        placeholder={index === 0 ? 'Captain name' : `Player ${index + 1} name`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Free Fire UID
                      </label>
                      <Input
                        value={player.freeFireUID}
                        onChange={(e) => handlePlayerChange(index, 'freeFireUID', e.target.value)}
                        className="bg-gaming-dark border-gaming-orange/30 text-white"
                        placeholder="Free Fire UID"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="heroImage" className="block text-sm font-medium text-gray-300 mb-1">
                Hero Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  {heroPreview && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img 
                          src={heroPreview} 
                          alt="Hero image preview" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageChange}
                    className="bg-gaming-dark border-gaming-orange/30 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Main hero image for the champion card
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="proofImage" className="block text-sm font-medium text-gray-300 mb-1">
                Proof Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  {proofPreview && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img 
                          src={proofPreview} 
                          alt="Proof image preview" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    id="proofImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProofImageChange}
                    className="bg-gaming-dark border-gaming-orange/30 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Screenshot or proof of championship win
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-300 mb-1">
                Gallery Images
              </label>
              <div className="flex flex-col gap-4">
                <Input
                  id="galleryImages"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="bg-gaming-dark border-gaming-orange/30 text-white"
                />
                <p className="text-xs text-gray-400">
                  Upload additional images or videos for the champion's gallery
                </p>
                
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Gallery image ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1"
                          onClick={() => removeGalleryPreview(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                {loading ? "Saving..." : currentChampion ? "Update Champion" : "Add Champion"}
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
              Are you sure you want to delete {currentChampion?.teamName} champion record? This action cannot be undone.
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
              onClick={handleDeleteChampion}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Champion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChampions;
