import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { components } from "@/types/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { editCompany, getCompanyById } from "@/api/company";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const industries = [
    "Information Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Construction",
    "Retail",
    "Hospitality",
    "Transport",
    "Manufacturing",
] as const;

const sizes = ["1-100", "100-500", "500-1000", "1000+"] as const;
type SizeType = (typeof sizes)[number];

const formSchema = z.object({
    title: z.string().min(2).max(50),
    desc: z.string().max(2000).optional(),
    size: z.enum(["1-100", "100-500", "500-1000", "1000+"]).optional(),
    industry: z.string().refine(
        (val) => industries.includes(val as any),
        { message: "Invalid industry" }
    ).optional(),
    website: z.url().max(50).optional().or(z.literal(""))
})

type Company = components["schemas"]["CompanyRead"]
type User = components['schemas']['UserRead'];

export default function EditCompanyPage() {
    const { id } = useParams();
    const [company, setCompany] = useState<Company | null>(null)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user.currentUser) as User | null;

    useEffect(() => {
        const fetchCompany = async () => {
            if (!id || !user) return;
            const res = await getCompanyById(id);
            if (res.success && res.result.creator_user.id === user.id) {
                setCompany(res.result);
                form.reset({
                    title: res.result.title,
                    desc: res.result.desc ?? null,
                    size: sizes.includes(res.result.size as SizeType)
                        ? (res.result.size as SizeType)
                        : undefined,
                    industry: res.result.industry ?? undefined,
                    website: res.result.website ?? undefined
                });
            } else {
                setError(res.error || "Not your company");
            }
            setLoading(false);
        };
        fetchCompany();
    }, [id, user]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: undefined,
            desc: undefined,
            size: undefined,
            industry: undefined,
            website: undefined
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            title: values.title,
            desc: values.desc === "" ? null : values.desc,
            industry: values.industry === "" ? null : values.industry,
            size: values.size ?? null,
            website: values.website === "" ? null : values.website,
        }

        if (company) {
            const result = await editCompany(company.id, data);
            if (result.success) {
                toast("✅ Company Edited Successfully!", {
                    description: "Your company has been edited. Good luck!",
                    action: { label: "View", onClick: () => navigate(`/cmp/${company.id}`) },
                });
                navigate("/employers")
            }
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="p-3 flex flex-col md:w-2/3 md:justify-self-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="desc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Size</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size..."  {...field} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizes.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry..."  {...field} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((ind) => (
                                                <SelectItem key={ind} value={ind}>
                                                    {ind}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div >
    )
}
