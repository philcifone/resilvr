import React from 'react'

export const Card = ({ className = "", children, ...props }) => {
  return (
    <div 
      className={`rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div 
      className={`flex flex-col space-y-1.5 p-6 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3 
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`} 
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div 
      className={`p-6 pt-0 ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}