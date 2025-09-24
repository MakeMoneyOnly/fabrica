import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ScrollBlurItem from '@/components/ui/ScrollBlurItem'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <ScrollBlurItem>
                <img
                    className="rounded-(--radius) grayscale"
                    src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="team image"
                    height=""
                    width=""
                    loading="lazy"
                />
                </ScrollBlurItem>

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <ScrollBlurItem>
                    <h2 className="text-4xl font-medium">The Meqenet Ecosystem: Empowering Ethiopia's Digital Commerce</h2>
                    </ScrollBlurItem>
                    <div className="space-y-6">
                        <ScrollBlurItem>
                        <p>Meqenet is more than just a payment method. We're building an ecosystem that connects shoppers, merchants, and financial institutions to drive growth and inclusion in Ethiopia's digital economy.</p>
                        </ScrollBlurItem>

                        <ScrollBlurItem>
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="#">
                                <span>Learn More About Meqenet</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                        </ScrollBlurItem>
                    </div>
                </div>
            </div>
        </section>
    )
}
