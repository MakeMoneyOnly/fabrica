'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import ScrollBlurItem from '@/components/ui/ScrollBlurItem'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does Stan Store Windsurf work?',
            answer: "Stan Store Windsurf is Ethiopia's first no-code storefront builder for creators. Simply sign up, use our drag-and-drop builder, add your digital products, and start selling instantly with Ethiopian payment integration."
        },
        {
            id: 'item-2',
            question: 'Who can use Stan Store Windsurf?',
            answer: 'Ethiopian creators, artists, educators, consultants, and entrepreneurs can all use Stan Store Windsurf. Whether you create digital products, offer services, or sell merchandise, our platform is designed for you.'
        },
        {
            id: 'item-3',
            question: 'Are there transaction fees?',
            answer: 'Zero platform fees! Unlike other marketplaces, we believe creators should keep 100% of their earnings. This is our unique value proposition in Ethiopia.'
        },
        {
            id: 'item-4',
            question: 'Which payment methods are supported?',
            answer: 'We support all major Ethiopian payment methods: WeBirr, TeleBirr, CBE Birr, and other local banking options. Your customers can pay using the methods they prefer.'
        },
        {
            id: 'item-5',
            question: 'Do I need technical skills?',
            answer: "No technical skills required! Our no-code builder lets you create a professional storefront in minutes. We also provide training, tutorials, and dedicated creator support in Amharic."
        }
    ];

    return (
        <section className="relative min-h-screen bg-gray-50 py-4 overflow-hidden">
            {/* Main Content Container - Equal spacing on both sides */}
            <div className="relative z-10 w-full h-[calc(100vh-25px)] px-2">
                {/* Black Card - Similar to hero card */}
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-black shadow-2xl">
                    {/* FAQ Content - Centered inside black card */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-16">
                        <div className="w-full max-w-4xl">
                            <div className="text-center mb-10">
                                <ScrollBlurItem>
                                <h2 className="text-balance text-3xl font-bold text-white md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                                </ScrollBlurItem>
                                <ScrollBlurItem>
                                <p className="text-white/80 mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                                </ScrollBlurItem>
                            </div>

                            <div className="mx-auto">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="bg-white w-full rounded-2xl border border-white/10 px-8 py-3 shadow-lg">
                                    {faqItems.map((item) => (
                                        <AccordionItem
                                            key={item.id}
                                            value={item.id}
                                            className="border-gray-200 border-dashed">
                                            <ScrollBlurItem>
                                            <AccordionTrigger className="cursor-pointer text-base text-black hover:text-gray-700 hover:no-underline">{item.question}</AccordionTrigger>
                                            </ScrollBlurItem>
                                            <AccordionContent>
                                                <ScrollBlurItem>
                                                <p className="text-base text-gray-800">{item.answer}</p>
                                                </ScrollBlurItem>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>

                                <ScrollBlurItem>
                                <p className="text-white/60 mt-6 px-8">
                                    Can&apos;t find what you&apos;re looking for? Contact our{' '}
                                    <Link
                                        href="#"
                                        className="text-green-400 font-medium hover:underline">
                                        customer support team
                                    </Link>
                                </p>
                                </ScrollBlurItem>
                            </div>
                        </div>
                    </div>

                    {/* Copyright/Attribution - Professional styling */}
                    <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-white/60 text-sm z-40 tracking-wide">
                        <ScrollBlurItem>
                        © 2025 Stan Store Windsurf
                        </ScrollBlurItem>
                    </div>
                </div>
            </div>
        </section>
    )
}
