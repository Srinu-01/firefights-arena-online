import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Plus, Upload } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { getCloudinaryUrl } from '@/lib/cloudinary';

interface Champion {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  country: string;
  game: string;
  socialMedia: {
    instagram: string;
    youtube: string;
    facebook: string;
    twitter: string;
  };
  isFeatured: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Champion name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  game: z.string().min(2, {
    message: "Game must be at least 2 characters.",
  }),
  instagram: z.string().url({ message: "Please enter a valid URL." }).optional(),
  youtube: z.string().url({ message: "Please enter a valid URL." }).optional(),
  facebook: z.string().url({ message: "Please enter a valid URL." }).optional(),
  twitter: z.string().url({ message: "Please enter a valid URL." }).optional(),
  isFeatured: z.boolean().default(false),
});

const AdminChampions: React.FC = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      country: "",
      game: "",
      instagram: "",
      youtube: "",
      facebook: "",
      twitter: "",
      isFeatured: false,
    },
  })

  useEffect(() => {
    const fetchChampions = async () => {
      setLoading(true);
      try {
        const championsCollection = collection(db, 'champions');
        const championsSnapshot = await getDocs(championsCollection);
        const championsList = championsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            country: data.country,
            game: data.game,
            socialMedia: data.socialMedia || {
              instagram: '',
              youtube: '',
              facebook: '',
              twitter: ''
            },
            isFeatured: data.isFeatured || false,
          };
        });
        setChampions(championsList);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
        toast({
          title: "Error!",
          description: "Failed to fetch champions.",
          variant: "destructive",
        })
      }
    };

    fetchChampions();
  }, [toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast({
					title: "Error!",
					description: "Image size should be less than 5MB.",
					variant: "destructive",
				})
				return;
			}
			setImageUpload(file);
			setPreviewImageUrl(URL.createObjectURL(file));
		}
	};

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      let imageUrl = values.imageUrl;

			if (imageUpload) {
				const storageRef = ref(storage, `champions/${uuidv4()}-${imageUpload.name}`);
				await uploadBytes(storageRef, imageUpload);
				imageUrl = await getDownloadURL(storageRef);
			}

      const championsCollection = collection(db, 'champions');
      await addDoc(championsCollection, {
        name: values.name,
        description: values.description,
        imageUrl: imageUrl,
        country: values.country,
        game: values.game,
        socialMedia: {
          instagram: values.instagram || '',
          youtube: values.youtube || '',
          facebook: values.facebook || '',
          twitter: values.twitter || ''
        },
        isFeatured: values.isFeatured,
      });

      // Refresh champions list
      const championsSnapshot = await getDocs(championsCollection);
      const championsList = championsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          country: data.country,
          game: data.game,
          socialMedia: data.socialMedia || {
            instagram: '',
            youtube: '',
            facebook: '',
            twitter: ''
          },
          isFeatured: data.isFeatured || false,
        };
      });
      setChampions(championsList);

      toast({
        title: "Success!",
        description: "Champion created successfully.",
      })
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error!",
        description: "Failed to create champion.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
      setIsDrawerOpen(false);
      form.reset();
			setImageUpload(null);
			setPreviewImageUrl(null);
    }
  }

  const handleEditChampion = (champion: Champion) => {
    setSelectedChampion(champion);
    form.setValue("name", champion.name);
    form.setValue("description", champion.description);
    form.setValue("imageUrl", champion.imageUrl);
    form.setValue("country", champion.country);
    form.setValue("game", champion.game);
    form.setValue("instagram", champion.socialMedia?.instagram || "");
    form.setValue("youtube", champion.socialMedia?.youtube || "");
    form.setValue("facebook", champion.socialMedia?.facebook || "");
    form.setValue("twitter", champion.socialMedia?.twitter || "");
    form.setValue("isFeatured", champion.isFeatured || false);
    setIsDialogOpen(true);
  };

  const handleUpdateChampion = async (values: z.infer<typeof formSchema>) => {
    if (!selectedChampion) return;

    try {
      setLoading(true);
      const championDocRef = doc(db, 'champions', selectedChampion.id);
      await updateDoc(championDocRef, {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
        country: values.country,
        game: values.game,
        socialMedia: {
          instagram: values.instagram || '',
          youtube: values.youtube || '',
          facebook: values.facebook || '',
          twitter: values.twitter || ''
        },
        isFeatured: values.isFeatured,
      });

      // Refresh champions list
      const championsCollection = collection(db, 'champions');
      const championsSnapshot = await getDocs(championsCollection);
      const championsList = championsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          country: data.country,
          game: data.game,
          socialMedia: data.socialMedia || {
            instagram: '',
            youtube: '',
            facebook: '',
            twitter: ''
          },
          isFeatured: data.isFeatured || false,
        };
      });
      setChampions(championsList);

      toast({
        title: "Success!",
        description: "Champion updated successfully.",
      })
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error!",
        description: "Failed to update champion.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
      setSelectedChampion(null);
      form.reset();
    }
  };

  const handleDeleteChampion = (champion: Champion) => {
    setSelectedChampion(champion);
    setIsDialogOpen(true);
  };

  const confirmDeleteChampion = async () => {
    if (!selectedChampion) return;

    try {
      setLoading(true);
      const championDocRef = doc(db, 'champions', selectedChampion.id);

			// Delete image from storage if the imageUrl is from Firebase Storage
			if (selectedChampion.imageUrl.startsWith("https://firebasestorage.googleapis.com")) {
				const imageRef = ref(storage, selectedChampion.imageUrl);
				await deleteObject(imageRef);
			}

      await deleteDoc(championDocRef);

      // Refresh champions list
      const championsCollection = collection(db, 'champions');
      const championsSnapshot = await getDocs(championsCollection);
      const championsList = championsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          country: data.country,
          game: data.game,
          socialMedia: data.socialMedia || {
            instagram: '',
            youtube: '',
            facebook: '',
            twitter: ''
          },
          isFeatured: data.isFeatured || false,
        };
      });
      setChampions(championsList);

      toast({
        title: "Success!",
        description: "Champion deleted successfully.",
      })
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error!",
        description: "Failed to delete champion.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
      setSelectedChampion(null);
    }
  };

  if (loading) {
    return <div>Loading champions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Champions</h1>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="border-gaming-orange/50 text-white hover:bg-gaming-orange/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Champion
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create a new Champion</DrawerTitle>
              <DrawerDescription>
                Add a new esports Champion to the list.
              </DrawerDescription>
            </DrawerHeader>
            <CardContent className="pl-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Champion name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Champion description"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

									<div className="flex flex-col space-y-2">
										<Label htmlFor="image">Upload Image</Label>
										<Input
											id="image"
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
										<Button variant="outline" asChild>
											<Label htmlFor="image" className="cursor-pointer">
												{imageUpload ? (
													<>
														<ImageIcon className="mr-2 h-4 w-4" />
														Change Image
													</>
												) : (
													<>
														<Upload className="mr-2 h-4 w-4" />
														Upload Image
													</>
												)}
											</Label>
										</Button>
										{previewImageUrl && (
											<div className="relative w-full rounded-md overflow-hidden">
												<AspectRatio ratio={16 / 9}>
													<img
														src={previewImageUrl}
														alt="Preview"
														className="object-cover"
													/>
												</AspectRatio>
											</div>
										)}
									</div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="game"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game</FormLabel>
                        <FormControl>
                          <Input placeholder="Game" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Instagram URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Youtube URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Youtube URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Facebook URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Twitter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Mark champion as featured.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button disabled={loading}>Create Champion</Button>
                </form>
              </Form>
            </CardContent>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <Table>
        <TableCaption>A list of your champions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {champions.map((champion) => (
            <TableRow key={champion.id}>
              <TableCell className="font-medium">
                <img
                  src={champion.imageUrl}
                  alt={champion.name}
                  className="w-20 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium">{champion.name}</TableCell>
              <TableCell>{champion.country}</TableCell>
              <TableCell>{champion.game}</TableCell>
              <TableCell>{champion.isFeatured ? 'Yes' : 'No'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEditChampion(champion)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteChampion(champion)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete <br />
              <b>{selectedChampion?.name}</b>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={confirmDeleteChampion}>
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Champion</AlertDialogTitle>
          </AlertDialogHeader>
          <CardContent className="pl-6 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateChampion)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Champion name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Champion description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="game"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game</FormLabel>
                      <FormControl>
                        <Input placeholder="Game" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Youtube URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Youtube URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Facebook URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Mark champion as featured.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <Button disabled={loading}>Update Champion</Button>
              </form>
            </Form>
          </CardContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminChampions;
