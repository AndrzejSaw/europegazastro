import * as React from "react"
import { useState } from "react"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function HeaderNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/about", label: "О нас" },
    { href: "/services", label: "Услуги" },
    { href: "/fleet", label: "Автопарк" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink href={link.href}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <a href="/careers">
          <Button variant="default">Вакансии</Button>
        </a>
      </div>

      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Открыть меню"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-background/100 z-50 md:hidden">
          <div className="absolute inset-0 -z-10 bg-background" />
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileMenu}
              aria-label="Закрыть меню"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col items-center justify-start h-full space-y-8 pt-16 pb-20">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-2xl font-semibold text-foreground hover:text-primary transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile CTA Button */}
            <div className="pt-8">
              <a href="/careers">
                <Button 
                  variant="default"
                  size="lg"
                  onClick={closeMobileMenu}
                  className="text-lg px-8 py-3"
                >
                  Вакансии
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
