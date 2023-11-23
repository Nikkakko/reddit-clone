'use client';
import createCommunityAction from '@/app/_actions/community';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { formSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface CreatePageProps {}

const CreatePage: React.FC<CreatePageProps> = ({}) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      startTransition(async () => {
        const data = await createCommunityAction(values.input);

        if (data.success) {
          toast({
            title: 'Community Created',
            description: 'Your community has been created.',
          });
          router.push(`/r/${data.success}`);
        } else if (data.error401) {
          toast({
            title: data.error401.title,
            description: data.error401.message,
            onClick: () => router.push('/sign-in'),
          });
        } else if (data.error409) {
          toast({
            title: data.error409.title,
            description: data.error409.message,
          });
        } else if (data.error422) {
          toast({
            title: data.error422.title,
            description: data.error422.message,
          });
        }
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Try again later.',
      });
    }
  }

  return (
    <div className='container flex item-center h-full max-w-3xl mx-auto'>
      <Card className='relative w-full h-fit  rounded-lg space-y-6 p-4'>
        <CardHeader className='flex flex-row justify-between items-center p-0'>
          <CardTitle className='text-xl font-semibold '>
            Create a Community
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <CardContent className='space-y-2'>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='input'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                          r/
                        </p>

                        <Input {...field} className='pl-6' />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Community names including capitalization cannot be
                      changed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className='flex justify-center md:justify-end gap-4 mt-8 pb-0 '>
                <Button variant='destructive' onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button variant='default' disabled={isPending} type='submit'>
                  {isPending && <Loader2 className='animate-spin mr-2' />}
                  Create Community
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePage;
