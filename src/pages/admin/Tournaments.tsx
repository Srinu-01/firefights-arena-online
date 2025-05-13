import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid'; // This line should be added to the imports
import { formatDate, formatTime } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface Tournament {
  id: string;
  tournamentName: string;
  gameName: string;
  platform: string;
  startDate: string;
  endDate: string;
  startDateTime: string;
  endDateTime: string;
  entryFee: number;
  prizePool: number;
  tournamentType: 'Solo' | 'Duo' | 'Squad';
  maxTeams: number;
  description: string;
  rules: string;
  status: 'Open' | 'Closed' | 'Completed';
  winner?: string;
  createdAt: string;
}

const formSchema = z.object({
  tournamentName: z.string().min(3, {
    message: "Tournament name must be at least 3 characters.",
  }),
  gameName: z.string().min(3, {
    message: "Game name must be at least 3 characters.",
  }),
  platform: z.string().min(3, {
    message: "Platform must be at least 3 characters.",
  }),
  startDate: z.string(),
  endDate: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  entryFee: z.number(),
  prizePool: z.number(),
  tournamentType: z.enum(['Solo', 'Duo', 'Squad']),
  maxTeams: z.number(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  rules: z.string().min(10, {
    message: "Rules must be at least 10 characters.",
  }),
  status: z.enum(['Open', 'Closed', 'Completed']),
});

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      gameName: "",
      platform: "",
      startDate: "",
      endDate: "",
      startDateTime: "",
      endDateTime: "",
      entryFee: 0,
      prizePool: 0,
      tournamentType: 'Solo',
      maxTeams: 0,
      description: "",
      rules: "",
      status: 'Open',
    },
  })

  async function getTournaments() {
    setLoading(true);
    try {
      const tournamentsCollection = collection(db, 'tournaments');
      const tournamentsQuery = query(tournamentsCollection, orderBy('createdAt', 'desc'));
      const tournamentsSnapshot = await getDocs(tournamentsQuery);
      const tournamentsList = tournamentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          tournamentName: data.tournamentName,
          gameName: data.gameName,
          platform: data.platform,
          startDate: data.startDate,
          endDate: data.endDate,
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          entryFee: data.entryFee,
          prizePool: data.prizePool,
          tournamentType: data.tournamentType,
          maxTeams: data.maxTeams,
          description: data.description,
          rules: data.rules,
          status: data.status,
          winner: data.winner,
          createdAt: data.createdAt,
        };
      });
      setTournaments(tournamentsList as Tournament[]);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTournaments();
  }, []);

  const onCreateTournament = async (values: z.infer<typeof formSchema>) => {
    try {
      const newTournament = {
        ...values,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'tournaments'), newTournament);
      toast({
        title: "Success",
        description: "Tournament created successfully.",
      })
      getTournaments(); // Refresh tournaments list
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreateModalOpen(false);
      form.reset();
    }
  };

  const onOpenEditModal = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    form.setValue("tournamentName", tournament.tournamentName);
    form.setValue("gameName", tournament.gameName);
    form.setValue("platform", tournament.platform);
    form.setValue("startDate", tournament.startDate);
    form.setValue("endDate", tournament.endDate);
    form.setValue("startDateTime", tournament.startDateTime);
    form.setValue("endDateTime", tournament.endDateTime);
    form.setValue("entryFee", tournament.entryFee);
    form.setValue("prizePool", tournament.prizePool);
    form.setValue("tournamentType", tournament.tournamentType);
    form.setValue("maxTeams", tournament.maxTeams);
    form.setValue("description", tournament.description);
    form.setValue("rules", tournament.rules);
    form.setValue("status", tournament.status);
    setIsEditModalOpen(true);
  };

  const onEditTournament = async (values: z.infer<typeof formSchema>) => {
    if (!selectedTournament) return;
    try {
      const tournamentRef = doc(db, 'tournaments', selectedTournament.id);
      await updateDoc(tournamentRef, values);
      toast({
        title: "Success",
        description: "Tournament updated successfully.",
      })
      getTournaments(); // Refresh tournaments list
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to update tournament. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEditModalOpen(false);
      setSelectedTournament(null);
      form.reset();
    }
  };

  const onDeleteTournament = async (id: string) => {
    try {
      const tournamentRef = doc(db, 'tournaments', id);
      await deleteDoc(tournamentRef);
      toast({
        title: "Success",
        description: "Tournament deleted successfully.",
      })
      getTournaments(); // Refresh tournaments list
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast({
        title: "Error",
        description: "Failed to delete tournament. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <div>
      <Helmet>
        <title>Admin | Tournaments</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Tournaments</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Tournament</Button>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Tournament</DialogTitle>
              <DialogDescription>
                Make changes to your tournament here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateTournament)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tournamentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tournament Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Game Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="Platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" placeholder="Start Time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" placeholder="End Time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="entryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Entry Fee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prizePool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prize Pool</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Prize Pool" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tournamentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Solo">Solo</SelectItem>
                          <SelectItem value="Duo">Duo</SelectItem>
                          <SelectItem value="Squad">Squad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxTeams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Teams</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Max Teams" {...field} />
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
                          placeholder="Tournament Description"
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
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tournament Rules"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Tournament</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Tournament</DialogTitle>
              <DialogDescription>
                Make changes to your tournament here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditTournament)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tournamentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tournament Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Game Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="Platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" placeholder="Start Time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" placeholder="End Time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="entryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Entry Fee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prizePool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prize Pool</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Prize Pool" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tournamentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Solo">Solo</SelectItem>
                          <SelectItem value="Duo">Duo</SelectItem>
                          <SelectItem value="Squad">Squad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxTeams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Teams</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Max Teams" {...field} />
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
                          placeholder="Tournament Description"
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
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tournament Rules"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Edit Tournament</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {loading ? (
          <p>Loading tournaments...</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Entry Fee</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.id}</TableCell>
                    <TableCell>{tournament.tournamentName}</TableCell>
                    <TableCell>{tournament.gameName}</TableCell>
                    <TableCell>{tournament.platform}</TableCell>
                    <TableCell>{formatDate(tournament.startDate)}</TableCell>
                    <TableCell>{formatDate(tournament.endDate)}</TableCell>
                    <TableCell>₹{tournament.entryFee}</TableCell>
                    <TableCell>₹{tournament.prizePool}</TableCell>
                    <TableCell>{tournament.status}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenEditModal(tournament)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteTournament(tournament.id)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournaments;
