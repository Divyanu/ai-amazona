import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="mt-auto border-t bg-slate-950 text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white">Get to Know Us</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                About Amazona
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Careers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white">Make Money with Us</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                Sell products
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Become an affiliate
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white">Payment Products</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                Business Card
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Shop with points
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white">Let Us Help You</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="#" className="hover:text-white">
                Your account
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white">
                Help
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Amazona. All rights reserved.
      </div>
    </footer>
  );
}
