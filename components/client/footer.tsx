import Link from "next/link"
import { Phone, Mail, MapPin, Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-bold">KK Jewelry Shop</h3>
            <p className="text-sm leading-relaxed text-secondary-foreground/80">
              Votre destination pour des bijoux modernes et élégants. Nous proposons une large sélection pour homme,
              femme et enfant.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Liens Rapides</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/bijoux"
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                Catalogue
              </Link>
              <Link
                href="/bijoux?audience=femme"
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                Bijoux Femme
              </Link>
              <Link
                href="/bijoux?audience=homme"
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                Bijoux Homme
              </Link>
              <Link
                href="/bijoux?audience=enfant"
                className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                Bijoux Enfant
              </Link>
              <Link
                href="/admin/login"
                className="mt-2 flex items-center gap-2 text-secondary-foreground/60 hover:text-primary transition-colors"
              >
                <Lock className="h-4 w-4" />
                Espace Administrateur
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+237 670 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@kkjewelry.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Douala, Cameroun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} KK Jewelry Shop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
