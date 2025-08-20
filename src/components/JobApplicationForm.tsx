'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  first_name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  citizenship: z.string().optional(),
  has_experience: z.string().optional(),
  code_95: z.string().optional(),
  license_year: z.string().optional(),
  residence_documents: z.string().optional(),
  'date-197': z.date({
    required_error: 'Дата обязательна',
  }),
  'acceptance-979': z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласие на обработку данных',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function JobApplicationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      email: '',
      phone: '',
      citizenship: '',
      has_experience: '',
      code_95: '',
      license_year: '',
      residence_documents: '',
      'acceptance-979': true,
    },
  })

  function onSubmit(data: FormValues) {
    console.log('Form data:', data)
    // TODO: Add fetch call to PHP script here
    toast.success('Заявка успешно отправлена!')
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ВАШЕ ИМЯ *</FormLabel>
              <FormControl>
                <Input placeholder="Введите ваше имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ВАШ EMAIL * (ПРОСИМ УКАЗЫВАТЬ ДЕЙСТВУЮЩИЙ АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ. РЕЗУЛЬТАТ РАССМОТРЕНИЯ ВАШЕЙ ЗАЯВКИ БУДЕТ НАПРАВЛЕН НА УКАЗАННЫЙ ВАМИ АДРЕС.)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Введите ваш email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ВАШ НОМЕР Whatsapp С МЕЖДУНАРОДНЫМ КОДОМ *</FormLabel>
              <FormControl>
                <Input placeholder="Введите ваш номер Whatsapp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="citizenship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ГРАЖДАНСТВО</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите гражданство" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="УКРАИНА">УКРАИНА</SelectItem>
                  <SelectItem value="БЕЛАРУСЬ">БЕЛАРУСЬ</SelectItem>
                  <SelectItem value="МОЛДОВА">МОЛДОВА</SelectItem>
                  <SelectItem value="КАЗАХСТАН">КАЗАХСТАН</SelectItem>
                  <SelectItem value="УЗБЕКИСТАН">УЗБЕКИСТАН</SelectItem>
                  <SelectItem value="КИРГИЗСТАН">КИРГИЗСТАН</SelectItem>
                  <SelectItem value="ТАДЖИКИСТАН">ТАДЖИКИСТАН</SelectItem>
                  <SelectItem value="ТУРКМЕНИСТАН">ТУРКМЕНИСТАН</SelectItem>
                  <SelectItem value="ГРУЗИЯ">ГРУЗИЯ</SelectItem>
                  <SelectItem value="АЗЕРБАЙДЖАН">АЗЕРБАЙДЖАН</SelectItem>
                  <SelectItem value="АРМЕНИЯ">АРМЕНИЯ</SelectItem>
                  <SelectItem value="ДРУГОЕ">ДРУГОЕ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ЕСТЬ ЛИ У ВАС ОПЫТ РАБОТЫ ВОДИТЕЛЕМ C+E В ЕВРОПЕ?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите опцию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="НЕТ">НЕТ</SelectItem>
                  <SelectItem value="ДА">ДА</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code_95"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ЕСТЬ ЛИ У ВАС КОД 95?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите опцию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="НЕТ">НЕТ</SelectItem>
                  <SelectItem value="ДА, ПОЛЬСКИЙ">ДА, ПОЛЬСКИЙ</SelectItem>
                  <SelectItem value="ДА, ДРУГОЙ СТРАНЫ ЕС">ДА, ДРУГОЙ СТРАНЫ ЕС</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>В КАКОМ ГОДУ ВЫ ПОЛУЧИЛИ ВОДИТЕЛЬСКИЕ ПРАВА КАТЕГОРИИ C?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите год" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ПОСЛЕ 09.09.2009 Г">ПОСЛЕ 09.09.2009 Г</SelectItem>
                  <SelectItem value="ДО 09.09.2009 Г">ДО 09.09.2009 Г</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residence_documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>КАКИЕ У ВАС ДОКУМЕНТЫ ДЛЯ ПРЕБЫВАНИЯ В ПОЛЬШЕ?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите документы" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ВИЗА ПОЛЬША">ВИЗА ПОЛЬША</SelectItem>
                  <SelectItem value="ВИЗА ДРУГАЯ СТРАНА ЕС">ВИЗА ДРУГАЯ СТРАНА ЕС</SelectItem>
                  <SelectItem value="ВНЖ (КАРТА ПОБЫТУ ПОЛЬША)">ВНЖ (КАРТА ПОБЫТУ ПОЛЬША)</SelectItem>
                  <SelectItem value="ВНЖ (ДРУГАЯ СТРАНА ЕС)">ВНЖ (ДРУГАЯ СТРАНА ЕС)</SelectItem>
                  <SelectItem value="ГРАЖДАНСТВО ОДНОЙ ИЗ СТРАН ЕС">ГРАЖДАНСТВО ОДНОЙ ИЗ СТРАН ЕС</SelectItem>
                  <SelectItem value="ТРЕБУЕТСЯ ПРИГЛАШЕНИЕ ДЛЯ ИЗГОТОВЛЕНИЯ ВИЗЫ">ТРЕБУЕТСЯ ПРИГЛАШЕНИЕ ДЛЯ ИЗГОТОВЛЕНИЯ ВИЗЫ</SelectItem>
                  <SelectItem value="ДРУГОЕ">ДРУГОЕ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date-197"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>С КАКОГО ЧИСЛА ВЫ МОЖЕТЕ ПРИСТУПИТЬ К РАБОТЕ (ПРИМЕРНО) *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'dd.MM.yyyy')
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date('1900-01-01')
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
          name="acceptance-979"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  WYRAŻAM ZGODĘ NA PRZETWARZANIE MOICH DANYCH OSOBOWYCH PRZEZ EURO-PEGAZ TRANSPORT SP. Z O.O., Z SIEDZIBĄ W WARSZAWIE W CELU PROWADZENIA REKRUTACJI NA APLIKOWANE PRZEZE MNIE STANOWISKO.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          ОТПРАВИТЬ ЗАЯВКУ
        </Button>
      </form>
    </Form>
  )
}
