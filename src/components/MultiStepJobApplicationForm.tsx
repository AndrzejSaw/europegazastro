'use client'

import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast, Toaster } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight, User, Briefcase, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  first_name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(1, 'Телефон обязателен'),
  citizenship: z.string().min(1, 'Гражданство обязательно'),
  has_experience: z.string().min(1, 'Выберите опыт работы'),
  code_95: z.string().min(1, 'Выберите наличие кода 95'),
  license_year: z.string().min(1, 'Выберите год получения прав'),
  'date-197': z.date({
    required_error: 'Дата начала работы обязательна',
  }),
  residence_documents: z.string().min(1, 'Выберите документы для пребывания'),
  'acceptance-979': z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласие на обработку данных',
  }),
})

type FormValues = z.infer<typeof formSchema>

const steps = [
  {
    id: 1,
    title: 'Личные данные',
    icon: User,
    fields: ['first_name', 'email', 'phone', 'citizenship']
  },
  {
    id: 2,
    title: 'Опыт работы',
    icon: Briefcase,
    fields: ['has_experience', 'code_95', 'license_year']
  },
  {
    id: 3,
    title: 'Документы',
    icon: FileText,
    fields: ['date-197', 'residence_documents', 'acceptance-979']
  }
]

const STORAGE_KEY = 'jobApplicationForm'

const defaultValues: FormValues = {
  first_name: '',
  email: '',
  phone: '',
  citizenship: 'УКРАИНА',
  has_experience: 'НЕТ',
  code_95: 'НЕТ',
  license_year: 'ПОСЛЕ 09.09.2009 Г',
  'date-197': undefined,
  residence_documents: 'ВИЗА ПОЛЬША',
  'acceptance-979': false,
}

export default function MultiStepJobApplicationForm() {
  // Prevent SSR issues
  const [isMounted, setIsMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldUnregister: false,
  })

  useEffect(() => {
    setIsMounted(true)

    if (typeof window === 'undefined') return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      const selectFields = ['citizenship', 'has_experience', 'code_95', 'license_year', 'residence_documents']
      const hasEmptySelects = selectFields.some(field => parsed[field] === '')
      if (hasEmptySelects) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      if (parsed['date-197']) {
        parsed['date-197'] = new Date(parsed['date-197'])
      }

      form.reset({ ...defaultValues, ...parsed })
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [form])

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    const subscription = form.watch(value => {
      if (typeof window === 'undefined') return

      const dataToSave: Record<string, unknown> = {}

      Object.entries(value).forEach(([key, val]) => {
        if (val === '' || val === null || val === undefined || val === (defaultValues as any)[key]) {
          return
        }
        if (key === 'date-197' && val instanceof Date) {
          dataToSave[key] = val.toISOString()
        } else {
          dataToSave[key] = val
        }
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    })

    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    console.log('Current step changed to:', currentStep)
  }, [currentStep])

  function onSubmit(data: FormValues) {
    console.log('Form data:', data)
    // TODO: Add fetch call to PHP script here
    toast.success('Заявка успешно отправлена!')
    
    // Clear localStorage on successful submission
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }

    form.reset(defaultValues)
    setCurrentStep(1)
  }

  const clearForm = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    form.reset(defaultValues)
    setCurrentStep(1)
    toast.success('Форма очищена')
  }

  const nextStep = async () => {
    console.log('NextStep called, current step:', currentStep)
    
    const currentStepData = steps.find(step => step.id === currentStep)
    if (!currentStepData) {
      console.error('Step not found:', currentStep)
      return
    }
    
    const currentStepFields = currentStepData.fields
    console.log('Fields to validate:', currentStepFields)
    
    // Get current form values for debugging
    const currentValues = form.getValues()
    console.log('Current form values:', currentValues)
    
    // Trigger validation for current step fields
    const isValid = await form.trigger(currentStepFields as (keyof FormValues)[])
    
    console.log('Validation result:', isValid)
    console.log('Form errors:', form.formState.errors)
    
    if (isValid) {
      if (currentStep < steps.length) {
        console.log('Moving to next step:', currentStep + 1)
        setCurrentStep(currentStep + 1)
        console.log('Step updated to:', currentStep + 1)
      } else {
        console.log('Already at last step')
      }
    } else {
      // Show which fields are invalid
      const invalidFields = currentStepFields.filter(field => 
        form.formState.errors[field as keyof FormValues]
      )
      console.log('Invalid fields:', invalidFields)
      toast.error('Пожалуйста, заполните все обязательные поля')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    console.log('Rendering step:', currentStep)
    
    try {
      switch (currentStep) {
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ваше имя *</FormLabel>
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
                  <FormLabel>Ваш email * (просим указывать действующий адрес электронной почты. Результат рассмотрения вашей заявки будет направлен на указанный вами адрес.)</FormLabel>
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
                  <FormLabel>Ваш номер WhatsApp с международным кодом *</FormLabel>
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
                  <FormLabel>Гражданство</FormLabel>
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
          </>
        )
      
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="has_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Есть ли у вас опыт работы водителем C+E в Европе?</FormLabel>
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
                  <FormLabel>Есть ли у вас код 95?</FormLabel>
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
                  <FormLabel>В каком году вы получили водительские права категории C?</FormLabel>
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
          </>
        )
      
      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="date-197"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>С какого числа вы можете приступить к работе (примерно) *</FormLabel>
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
                          {field.value && field.value instanceof Date ? (
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
                          date < new Date()
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
              name="residence_documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Какие у вас документы для пребывания в Польше?</FormLabel>
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
          </>
        )
      
      default:
        return null
    }
    } catch (error) {
      console.error('Error rendering step:', error)
      return <div>Ошибка при рендеринге формы</div>
    }
  }

  // Prevent hydration issues
  if (!isMounted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Загрузка формы...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto" key="job-application-form">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
                  isActive ? "bg-yellow-600 border-yellow-600 text-white" :
                  isCompleted ? "bg-green-600 border-green-600 text-white" :
                  "bg-gray-100 border-gray-300 text-gray-400"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-1 w-20 mx-2 transition-colors",
                    isCompleted ? "bg-green-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            )
          })}
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {steps.find(step => step.id === currentStep)?.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Шаг {currentStep} из {steps.length}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Анкета водителя</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Назад
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Очистить
                  </Button>
                </div>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Далее
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    ОТПРАВИТЬ ЗАЯВКУ
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
