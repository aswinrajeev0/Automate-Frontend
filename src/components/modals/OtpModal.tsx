"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, AlertTriangle, Check, Loader2, Timer } from "lucide-react"
import { useToast } from "../../hooks/ui/useToast"

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  onResend: () => void
  isLoading?: boolean
  email?: string
  title?: string
  subtitle?: string
  otpLength?: number
}

const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  isLoading = false,
  email = "",
  title = "Verification Code",
  subtitle = "Enter the 6-digit code sent to your email",
  otpLength = 6,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(60) // 60 seconds = 1 minute
  const [canResend, setCanResend] = useState<boolean>(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { toast } = useToast()
  // const [expireTime, setExpireTime] = useState(120)

  // Reset OTP, errors, and timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(otpLength).fill(""))
      setErrorMessage("")
      setActiveInput(0)
      setTimeLeft(60)
      setCanResend(false)
      // Focus the first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen, otpLength])

  // Timer effect
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    // Get only the last character if multiple characters are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Clear any error message
    setErrorMessage("")

    // If input is filled, move to the next input
    if (value && index < otpLength - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // If all inputs are filled, validate the OTP
    if (index === otpLength - 1 && value && !newOtp.includes("")) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a number and has the right length
    if (!/^\d+$/.test(pastedData)) {
      setErrorMessage("Please paste numbers only")
      return
    }

    // Fill the OTP fields with the pasted digits
    const newOtp = [...otp]
    for (let i = 0; i < Math.min(pastedData.length, otpLength); i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, otpLength - 1)
    setActiveInput(nextIndex)
    inputRefs.current[nextIndex]?.focus()

    // Verify if all digits are filled
    if (!newOtp.includes("") && newOtp.length === otpLength) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleVerify = (otpValue: string) => {
    onVerify(otpValue)
  }

  // Resend OTP function
  const handleResendOTP = () => {
    if (!canResend && timeLeft > 0) return

    onResend()

    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your email.",
      duration: 3000,
    })

    // Reset timer
    setTimeLeft(60)
    setCanResend(false)
  }

  // Close the modal if Escape key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

      <div
        className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-2xl border border-amber-500 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-black rounded-full p-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-400"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold uppercase tracking-wider">Automate</h2>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
          {email && <p className="text-gray-800 font-medium mt-1">{email}</p>}
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: otpLength }).map((_, index) => (
            <input
              key={index}
              type="text"
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-xl rounded border-2 
              ${index === activeInput ? "border-amber-500" : "border-gray-300"} 
              focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-200`}
              maxLength={1}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {errorMessage && (
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={16} className="mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.includes("") || isLoading}
            className={`w-full h-12 bg-black text-amber-400 font-semibold rounded-md 
              ${otp.includes("") || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900 transition-colors"}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="mr-2 inline animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Check size={18} className="mr-2 inline" />
                Verify Code
              </>
            )}
          </button>

          <button
            onClick={handleResendOTP}
            disabled={(!canResend && timeLeft > 0) || isLoading}
            className={`w-full h-12 bg-white border border-amber-500 text-black font-medium rounded-md transition-colors
              ${(!canResend && timeLeft > 0) || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-50"}`}
          >
            {!canResend && timeLeft > 0 ? `Resend Code (${formatTime(timeLeft)})` : "Resend Code"}
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-600 flex items-center justify-center">
          <Timer size={16} className="mr-2" />
          {canResend ? (
            <span>Code has expired. Please request a new one.</span>
          ) : (
            <span>
              Code expires in <span className="text-black font-medium">{formatTime(timeLeft)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTPModal

