import { 
  WashingMachine, Wallet, Calendar, Key, Shield, Smartphone, 
  HelpCircle, ChevronDown, ArrowLeft, Users, Clock, CreditCard,
  CheckCircle, AlertCircle, MapPin, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import DesignerCredit from "@/components/DesignerCredit";
import LanguageToggle from "@/components/LanguageToggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";

const UserManual = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "User Manual",
      subtitle: "Complete guide to using SmartWash",
      backToLogin: "Back to Login",
      sections: {
        gettingStarted: {
          title: "Getting Started",
          items: [
            {
              question: "How do I create an account?",
              answer: "Click on 'Register' on the login page. Fill in your full name, email, phone number, student ID, and create a password. After registration, you can immediately log in to your account."
            },
            {
              question: "How do I log in?",
              answer: "Enter your registered email and password on the login page, then click 'Sign In'. You'll be redirected to your dashboard."
            },
            {
              question: "I forgot my password. What should I do?",
              answer: "Contact the administrator to reset your password. In future updates, we'll add a password recovery feature."
            }
          ]
        },
        booking: {
          title: "Booking a Washing Slot",
          items: [
            {
              question: "How do I book a washing machine?",
              answer: "1. Go to Dashboard and click 'Book Washing'\n2. Select your preferred location\n3. Choose a date (up to 7 days in advance)\n4. Select an available time slot\n5. Click 'Confirm Booking' to complete"
            },
            {
              question: "How much does one slot cost?",
              answer: "Each washing slot costs ৳50 and lasts for 1.5 hours (90 minutes)."
            },
            {
              question: "What is the OTP and how do I use it?",
              answer: "After booking, you'll receive a 6-digit OTP (One-Time Password). Enter this OTP on the washing machine's keypad to start your wash. The OTP is only valid during your booked time slot."
            },
            {
              question: "Can I cancel my booking?",
              answer: "Currently, bookings cannot be cancelled once confirmed. Please make sure you select the correct date and time before confirming."
            }
          ]
        },
        balance: {
          title: "Balance & Recharge",
          items: [
            {
              question: "How do I check my balance?",
              answer: "Your current balance is always visible in the header area of the app. You can also see it on the Dashboard and Recharge pages."
            },
            {
              question: "How do I add balance to my account?",
              answer: "1. Go to 'Add Balance' from the Dashboard\n2. Enter the amount you want to add (minimum ৳50)\n3. Select your payment method (bKash, Nagad, Rocket, or Card)\n4. Complete the payment on the payment app\n5. Enter the Transaction ID\n6. Optionally upload a screenshot of your payment\n7. Submit the request for approval"
            },
            {
              question: "How long does recharge approval take?",
              answer: "Recharge requests are manually verified by administrators. This usually takes a few hours during working hours. You'll see the balance update once approved."
            },
            {
              question: "What if my recharge is rejected?",
              answer: "If your recharge is rejected, please ensure you've entered the correct transaction ID and the payment was successful. Contact the administrator if you believe there's an error."
            }
          ]
        },
        tips: {
          title: "Tips & Best Practices",
          items: [
            {
              question: "When is the best time to book?",
              answer: "Early morning (6:00-9:00 AM) and evening (6:00-9:00 PM) slots are usually the most popular. Book in advance to secure your preferred time."
            },
            {
              question: "What should I bring?",
              answer: "Bring your own detergent, fabric softener (optional), and laundry bag. Make sure your clothes are sorted by color before arriving."
            },
            {
              question: "How do I save the app to my phone?",
              answer: "On iPhone: Open in Safari, tap Share, then 'Add to Home Screen'\nOn Android: Open in Chrome, tap the menu, then 'Add to Home Screen' or 'Install App'"
            }
          ]
        }
      },
      quickGuide: {
        title: "Quick Start Guide",
        steps: [
          { icon: Users, text: "Register your account" },
          { icon: Wallet, text: "Add balance via bKash/Nagad" },
          { icon: Calendar, text: "Book your time slot" },
          { icon: Key, text: "Use OTP to start washing" },
          { icon: CheckCircle, text: "Collect your clean clothes!" }
        ]
      },
      installPWA: {
        title: "Install SmartWash App",
        description: "Install SmartWash on your phone for quick access!",
        instructions: {
          ios: "On iPhone: Safari → Share → Add to Home Screen",
          android: "On Android: Chrome Menu → Install App"
        }
      }
    },
    bn: {
      title: "ব্যবহারকারী ম্যানুয়াল",
      subtitle: "স্মার্টওয়াশ ব্যবহারের সম্পূর্ণ গাইড",
      backToLogin: "লগইনে ফিরে যান",
      sections: {
        gettingStarted: {
          title: "শুরু করা",
          items: [
            {
              question: "কিভাবে অ্যাকাউন্ট তৈরি করবো?",
              answer: "লগইন পেজে 'রেজিস্টার' এ ক্লিক করুন। আপনার পুরো নাম, ইমেইল, ফোন নম্বর, স্টুডেন্ট আইডি দিন এবং পাসওয়ার্ড তৈরি করুন। রেজিস্ট্রেশনের পর আপনি সাথে সাথে লগইন করতে পারবেন।"
            },
            {
              question: "কিভাবে লগইন করবো?",
              answer: "লগইন পেজে আপনার রেজিস্টার্ড ইমেইল এবং পাসওয়ার্ড দিন, তারপর 'সাইন ইন' এ ক্লিক করুন। আপনি ড্যাশবোর্ডে চলে যাবেন।"
            },
            {
              question: "পাসওয়ার্ড ভুলে গেছি। কি করবো?",
              answer: "পাসওয়ার্ড রিসেট করতে অ্যাডমিনের সাথে যোগাযোগ করুন। ভবিষ্যতে আমরা পাসওয়ার্ড রিকভারি ফিচার যোগ করবো।"
            }
          ]
        },
        booking: {
          title: "ওয়াশিং স্লট বুক করা",
          items: [
            {
              question: "কিভাবে ওয়াশিং মেশিন বুক করবো?",
              answer: "১. ড্যাশবোর্ডে গিয়ে 'বুক ওয়াশিং' এ ক্লিক করুন\n২. আপনার পছন্দের লোকেশন নির্বাচন করুন\n৩. তারিখ বেছে নিন (৭ দিন আগে পর্যন্ত)\n৪. একটি খালি টাইম স্লট নির্বাচন করুন\n৫. 'কনফার্ম বুকিং' এ ক্লিক করে সম্পন্ন করুন"
            },
            {
              question: "একটি স্লটের দাম কত?",
              answer: "প্রতিটি ওয়াশিং স্লটের দাম ৳৫০ এবং সময় ১.৫ ঘন্টা (৯০ মিনিট)।"
            },
            {
              question: "OTP কি এবং কিভাবে ব্যবহার করবো?",
              answer: "বুকিং করার পর আপনি একটি ৬ সংখ্যার OTP (ওয়ান-টাইম পাসওয়ার্ড) পাবেন। ওয়াশিং মেশিনের কীপ্যাডে এই OTP দিয়ে ওয়াশ শুরু করুন। OTP শুধুমাত্র আপনার বুক করা সময়ে কাজ করবে।"
            },
            {
              question: "বুকিং ক্যান্সেল করা যায়?",
              answer: "বর্তমানে কনফার্ম করার পর বুকিং ক্যান্সেল করা যায় না। অনুগ্রহ করে কনফার্ম করার আগে সঠিক তারিখ ও সময় নিশ্চিত করুন।"
            }
          ]
        },
        balance: {
          title: "ব্যালেন্স ও রিচার্জ",
          items: [
            {
              question: "কিভাবে ব্যালেন্স দেখবো?",
              answer: "আপনার বর্তমান ব্যালেন্স অ্যাপের হেডারে সবসময় দেখা যায়। ড্যাশবোর্ড এবং রিচার্জ পেজেও দেখতে পারবেন।"
            },
            {
              question: "কিভাবে ব্যালেন্স যোগ করবো?",
              answer: "১. ড্যাশবোর্ড থেকে 'ব্যালেন্স যোগ করুন' এ যান\n২. পরিমাণ লিখুন (সর্বনিম্ন ৳৫০)\n৩. পেমেন্ট মেথড নির্বাচন করুন (বিকাশ, নগদ, রকেট, বা কার্ড)\n৪. পেমেন্ট অ্যাপে পেমেন্ট সম্পন্ন করুন\n৫. ট্রানজেকশন আইডি দিন\n৬. পেমেন্টের স্ক্রিনশট আপলোড করুন (ঐচ্ছিক)\n৭. অ্যাপ্রুভালের জন্য সাবমিট করুন"
            },
            {
              question: "রিচার্জ অ্যাপ্রুভ হতে কত সময় লাগে?",
              answer: "রিচার্জ রিকোয়েস্ট অ্যাডমিন দ্বারা ম্যানুয়ালি যাচাই করা হয়। অফিস সময়ে সাধারণত কয়েক ঘন্টা লাগে। অ্যাপ্রুভ হলে ব্যালেন্স আপডেট দেখতে পাবেন।"
            },
            {
              question: "রিচার্জ রিজেক্ট হলে কি করবো?",
              answer: "রিচার্জ রিজেক্ট হলে নিশ্চিত করুন যে সঠিক ট্রানজেকশন আইডি দিয়েছেন এবং পেমেন্ট সফল হয়েছে। কোনো ভুল মনে হলে অ্যাডমিনের সাথে যোগাযোগ করুন।"
            }
          ]
        },
        tips: {
          title: "টিপস ও পরামর্শ",
          items: [
            {
              question: "কখন বুক করা ভালো?",
              answer: "সকাল (৬:০০-৯:০০) এবং সন্ধ্যা (৬:০০-৯:০০) স্লট সাধারণত বেশি জনপ্রিয়। আপনার পছন্দের সময় পেতে আগে থেকে বুক করুন।"
            },
            {
              question: "কি কি নিয়ে যাবো?",
              answer: "নিজের ডিটারজেন্ট, ফেব্রিক সফটনার (ঐচ্ছিক), এবং লন্ড্রি ব্যাগ নিয়ে যান। আসার আগে রঙ অনুযায়ী কাপড় আলাদা করে নিন।"
            },
            {
              question: "কিভাবে অ্যাপ ফোনে সেভ করবো?",
              answer: "আইফোনে: Safari তে খুলুন, Share ট্যাপ করুন, তারপর 'Add to Home Screen'\nঅ্যান্ড্রয়েডে: Chrome এ মেনু ট্যাপ করুন, তারপর 'Add to Home Screen' বা 'Install App'"
            }
          ]
        }
      },
      quickGuide: {
        title: "দ্রুত শুরু গাইড",
        steps: [
          { icon: Users, text: "অ্যাকাউন্ট রেজিস্টার করুন" },
          { icon: Wallet, text: "বিকাশ/নগদে ব্যালেন্স যোগ করুন" },
          { icon: Calendar, text: "আপনার টাইম স্লট বুক করুন" },
          { icon: Key, text: "OTP দিয়ে ওয়াশিং শুরু করুন" },
          { icon: CheckCircle, text: "পরিষ্কার কাপড় নিয়ে যান!" }
        ]
      },
      installPWA: {
        title: "স্মার্টওয়াশ অ্যাপ ইনস্টল করুন",
        description: "দ্রুত অ্যাক্সেসের জন্য ফোনে ইনস্টল করুন!",
        instructions: {
          ios: "আইফোনে: Safari → Share → Add to Home Screen",
          android: "অ্যান্ড্রয়েডে: Chrome Menu → Install App"
        }
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <DesignerCredit />

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t.backToLogin}
        </Link>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-lg shadow-primary/30 mb-4">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>

        {/* Quick Start Guide */}
        <GlassCard className="mb-8 animate-fade-in-up animation-delay-100">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <WashingMachine className="w-5 h-5 text-primary" />
              {t.quickGuide.title}
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {t.quickGuide.steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 min-w-[100px]">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center text-muted-foreground">{step.text}</span>
                  {index < t.quickGuide.steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Install PWA Section */}
        <GlassCard className="mb-8 animate-fade-in-up animation-delay-200 border-l-4 border-primary">
          <GlassCardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t.installPWA.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t.installPWA.description}</p>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    {t.installPWA.instructions.ios}
                  </p>
                  <p className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    {t.installPWA.instructions.android}
                  </p>
                </div>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {Object.entries(t.sections).map(([key, section], sectionIndex) => (
            <GlassCard key={key} className="animate-fade-in-up" style={{ animationDelay: `${(sectionIndex + 3) * 100}ms` }}>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  {key === "gettingStarted" && <Users className="w-5 h-5 text-primary" />}
                  {key === "booking" && <Calendar className="w-5 h-5 text-primary" />}
                  {key === "balance" && <Wallet className="w-5 h-5 text-primary" />}
                  {key === "tips" && <AlertCircle className="w-5 h-5 text-primary" />}
                  {section.title}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.items.map((item, index) => (
                    <AccordionItem key={index} value={`${key}-${index}`}>
                      <AccordionTrigger className="text-left text-foreground hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-muted-foreground">
          <p>© 2025 SmartWash. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default UserManual;
