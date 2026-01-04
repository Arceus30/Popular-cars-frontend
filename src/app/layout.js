import "./globals.css";

export const metadata = {
    title: "Popular Cars",
    description: "List of popular cars in US",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
