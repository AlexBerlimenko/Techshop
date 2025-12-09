import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  company: {
    title: "Компанія",
    links: [
      { label: "Про нас", href: "/about" },
      { label: "Контакти", href: "/contacts" },
      { label: "Вакансії", href: "/careers" },
    ],
  },
  help: {
    title: "Допомога",
    links: [
      { label: "Доставка та оплата", href: "/delivery" },
      { label: "Гарантія", href: "/warranty" },
      { label: "Повернення товару", href: "/returns" },
    ],
  },
  services: {
    title: "Сервіси",
    links: [
      { label: "Trade-In", href: "/trade-in" },
      { label: "Ремонт техніки", href: "/repair" },
      { label: "Кредит", href: "/credit" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-loki-dark-gray border-t border-loki-border-gray mt-8">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & contacts */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-loki-turquoise rounded-lg flex items-center justify-center">
                <span className="text-loki-black font-bold">L</span>
              </div>
              <span className="text-lg font-bold text-white">LokiStore</span>
            </Link>
            <p className="text-sm text-loki-soft-gray mb-4 max-w-xs">Офіційний інтернет-магазин техніки з гарантією.</p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+380501234567"
                className="flex items-center gap-2 text-loki-soft-gray hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +38 (050) 123-45-67
              </a>
              <a
                href="mailto:info@lokistore.ua"
                className="flex items-center gap-2 text-loki-soft-gray hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@lokistore.ua
              </a>
              <div className="flex items-center gap-2 text-loki-soft-gray">
                <MapPin className="w-4 h-4" />
                Київ, вул. Хрещатик, 1
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-3 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-loki-soft-gray hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-loki-border-gray">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-loki-soft-gray">© 2025 LokiStore. Всі права захищені.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-loki-soft-gray hover:text-white transition-colors">
                Конфіденційність
              </Link>
              <Link href="/terms" className="text-xs text-loki-soft-gray hover:text-white transition-colors">
                Умови
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
