"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Download, Plus, Trash2, Copy, Upload, Save, FileUp, Info, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CategoryPieChart from "./category-pie-chart"

// Define types for our data structure
type CategoryLevel = "major" | "medium" | "minor"

// First, let's update the CategoryItem interface to include perPerson and multiplier properties
interface CategoryItem {
  id: string
  name: string
  level: CategoryLevel
  parentId: string | null
  values: Record<string, number>
  isExpanded?: boolean
  description?: string
  perPerson?: boolean
  multiplier?: number
}

export default function PlanningSpreadsheet() {
  const months = [
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
    "1月",
    "2月",
    "3月",
  ]

  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [activeTab, setActiveTab] = useState<"sales" | "expenses">("sales")
  // Now let's replace the variableMultiplier state with monthly headcount
  // Remove this line:
  // And add this instead:
  const [monthlyHeadcount, setMonthlyHeadcount] = useState<Record<string, number>>(
    Object.fromEntries(months.map((month) => [month, 10])),
  )
  const [showPieChart, setShowPieChart] = useState<boolean>(false)
  const [pieChartLevel, setPieChartLevel] = useState<"major" | "medium">("major")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with some default categories
  useEffect(() => {
    const initialSalesCategories: CategoryItem[] = [
      // --- 売上 ---
      { id: "sales-1", name: "製品売上", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "sales-1-1", name: "プロダクト A", level: "medium", parentId: "sales-1", values: {}, isExpanded: true },
      { id: "sales-1-1-1", name: "オンライン販売", level: "minor", parentId: "sales-1-1", values: {} },
      { id: "sales-1-1-2", name: "直接販売", level: "minor", parentId: "sales-1-1", values: {} },
      { id: "sales-1-1-3", name: "代理店販売", level: "minor", parentId: "sales-1-1", values: {} },
      { id: "sales-1-2", name: "プロダクト B", level: "medium", parentId: "sales-1", values: {}, isExpanded: true },
      { id: "sales-1-2-1", name: "オンライン販売", level: "minor", parentId: "sales-1-2", values: {} },
      { id: "sales-1-2-2", name: "直接販売", level: "minor", parentId: "sales-1-2", values: {} },
      { id: "sales-1-3", name: "新規プロダクト", level: "medium", parentId: "sales-1", values: {}, isExpanded: true },
      { id: "sales-1-3-1", name: "ベータ版販売", level: "minor", parentId: "sales-1-3", values: {} },
    
      { id: "sales-2", name: "サービス売上", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "sales-2-1", name: "コンサルティング", level: "medium", parentId: "sales-2", values: {}, isExpanded: true },
      { id: "sales-2-1-1", name: "戦略コンサル", level: "minor", parentId: "sales-2-1", values: {} },
      { id: "sales-2-1-2", name: "導入支援", level: "minor", parentId: "sales-2-1", values: {} },
      { id: "sales-2-2", name: "カスタマイズ開発", level: "medium", parentId: "sales-2", values: {}, isExpanded: true },
      { id: "sales-2-2-1", name: "要件定義フェーズ", level: "minor", parentId: "sales-2-2", values: {} },
      { id: "sales-2-2-2", name: "開発フェーズ", level: "minor", parentId: "sales-2-2", values: {} },
      { id: "sales-2-3", name: "保守・サポート", level: "medium", parentId: "sales-2", values: {}, isExpanded: true },
      { id: "sales-2-3-1", name: "月額サポート", level: "minor", parentId: "sales-2-3", values: {} },
      { id: "sales-2-3-2", name: "スポット対応", level: "minor", parentId: "sales-2-3", values: {} },
    
      { id: "sales-3", name: "その他売上", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "sales-3-1", name: "ライセンス収入", level: "medium", parentId: "sales-3", values: {}, isExpanded: true },
      { id: "sales-3-1-1", name: "技術ライセンス", level: "minor", parentId: "sales-3-1", values: {} },
      { id: "sales-3-2", name: "受託研究開発", level: "medium", parentId: "sales-3", values: {}, isExpanded: true },
      { id: "sales-3-2-1", name: "共同研究", level: "minor", parentId: "sales-3-2", values: {} },
    ]
    
    const initialExpenseCategories: CategoryItem[] = [
      // --- 経費 ---
      { id: "exp-1", name: "売上原価 (COGS)", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "exp-1-1", name: "仕入原価", level: "medium", parentId: "exp-1", values: {}, isExpanded: true },
      { id: "exp-1-1-1", name: "原材料費", level: "minor", parentId: "exp-1-1", values: {} },
      { id: "exp-1-1-2", name: "部品費", level: "minor", parentId: "exp-1-1", values: {} },
      { id: "exp-1-1-3", name: "外注加工費", level: "minor", parentId: "exp-1-1", values: {} },
      { id: "exp-1-2", name: "労務費 (直接)", level: "medium", parentId: "exp-1", values: {}, isExpanded: true },
      { id: "exp-1-2-1", name: "製造部門給与", level: "minor", parentId: "exp-1-2", values: {} },
      { id: "exp-1-3", name: "製造経費", level: "medium", parentId: "exp-1", values: {}, isExpanded: true },
      { id: "exp-1-3-1", name: "減価償却費 (製造設備)", level: "minor", parentId: "exp-1-3", values: {} },
      { id: "exp-1-3-2", name: "工場消耗品費", level: "minor", parentId: "exp-1-3", values: {} },
    
      { id: "exp-2", name: "販売費及び一般管理費 (SG&A)", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "exp-2-1", name: "人件費", level: "medium", parentId: "exp-2", values: {}, isExpanded: true },
      { id: "exp-2-1-1", name: "役員報酬", level: "minor", parentId: "exp-2-1", values: {} },
      { id: "exp-2-1-2", name: "従業員給与 (販管)", level: "minor", parentId: "exp-2-1", values: {} },
      { id: "exp-2-1-3", name: "福利厚生費", level: "minor", parentId: "exp-2-1", values: {} },
      { id: "exp-2-1-4", name: "採用教育費", level: "minor", parentId: "exp-2-1", values: {} },
      { id: "exp-2-2", name: "マーケティング費用", level: "medium", parentId: "exp-2", values: {}, isExpanded: true },
      { id: "exp-2-2-1", name: "広告宣伝費", level: "minor", parentId: "exp-2-2", values: {} },
      { id: "exp-2-2-2", name: "販売促進費", level: "minor", parentId: "exp-2-2", values: {} },
      { id: "exp-2-2-3", name: "広報費 (PR)", level: "minor", parentId: "exp-2-2", values: {} },
      { id: "exp-2-3", name: "地代家賃", level: "medium", parentId: "exp-2", values: {}, isExpanded: true },
      { id: "exp-2-3-1", name: "オフィス賃料", level: "minor", parentId: "exp-2-3", values: {} },
      { id: "exp-2-3-2", name: "倉庫賃料", level: "minor", parentId: "exp-2-3", values: {} },
      { id: "exp-2-4", name: "業務委託費", level: "medium", parentId: "exp-2", values: {}, isExpanded: true },
      { id: "exp-2-4-1", name: "顧問料 (弁護士・会計士等)", level: "minor", parentId: "exp-2-4", values: {} },
      { id: "exp-2-4-2", name: "外部コンサルティング", level: "minor", parentId: "exp-2-4", values: {} },
      { id: "exp-2-5", name: "その他販管費", level: "medium", parentId: "exp-2", values: {}, isExpanded: true },
      { id: "exp-2-5-1", name: "旅費交通費", level: "minor", parentId: "exp-2-5", values: {} },
      { id: "exp-2-5-2", name: "通信費", level: "minor", parentId: "exp-2-5", values: {} },
      { id: "exp-2-5-3", name: "水道光熱費", level: "minor", parentId: "exp-2-5", values: {} },
      { id: "exp-2-5-4", name: "消耗品費", level: "minor", parentId: "exp-2-5", values: {} },
      { id: "exp-2-5-5", name: "租税公課", level: "minor", parentId: "exp-2-5", values: {} },
    
      { id: "exp-3", name: "研究開発費 (R&D)", level: "major", parentId: null, values: {}, isExpanded: true },
      { id: "exp-3-1", name: "人件費 (R&D)", level: "medium", parentId: "exp-3", values: {}, isExpanded: true },
      { id: "exp-3-1-1", name: "研究員・開発者給与", level: "minor", parentId: "exp-3-1", values: {} },
      { id: "exp-3-1-2", name: "福利厚生費 (R&D)", level: "minor", parentId: "exp-3-1", values: {} },
      { id: "exp-3-2", name: "研究開発材料費", level: "medium", parentId: "exp-3", values: {}, isExpanded: true },
      { id: "exp-3-2-1", name: "試作品材料費", level: "minor", parentId: "exp-3-2", values: {} },
      { id: "exp-3-3", name: "外注研究開発費", level: "medium", parentId: "exp-3", values: {}, isExpanded: true },
      { id: "exp-3-3-1", name: "外部委託開発費", level: "minor", parentId: "exp-3-3", values: {} },
      { id: "exp-3-4", name: "その他研究開発費", level: "medium", parentId: "exp-3", values: {}, isExpanded: true },
      { id: "exp-3-4-1", name: "減価償却費 (研究設備)", level: "minor", parentId: "exp-3-4", values: {} },
      { id: "exp-3-4-2", name: "学会参加費・書籍代", level: "minor", parentId: "exp-3-4", values: {} },
    ]

    if (activeTab === "sales") {
      setCategories(initialSalesCategories)
    } else {
      setCategories(initialExpenseCategories)
    }
  }, [activeTab])

  // Handle value changes
  // Replace the handleValueChange function to account for per-person calculations
  const handleValueChange = (categoryId: string, month: string, value: string) => {
    const numValue = value === "" ? 0 : Number.parseFloat(value)

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            values: {
              ...category.values,
              [month]: isNaN(numValue) ? 0 : numValue,
            },
          }
        }
        return category
      }),
    )
  }

  // Add a function to update monthly headcount
  const updateMonthlyHeadcount = (month: string, value: string) => {
    const numValue = value === "" ? 0 : Number.parseFloat(value)

    setMonthlyHeadcount((prev) => ({
      ...prev,
      [month]: isNaN(numValue) ? 0 : numValue,
    }))
  }

  // Add a function to toggle per-person status and set multiplier
  const togglePerPersonCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          // If already per-person, toggle it off
          if (category.perPerson) {
            const { perPerson, multiplier, ...rest } = category
            return rest
          } else {
            // Otherwise, toggle it on with default multiplier of 1
            return {
              ...category,
              perPerson: true,
              multiplier: 1,
            }
          }
        }
        return category
      }),
    )
  }

  // Add a function to update the multiplier for a per-person category
  const updateCategoryMultiplier = (categoryId: string, multiplier: number) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            multiplier,
          }
        }
        return category
      }),
    )
  }

  // Update category description
  const updateCategoryDescription = (categoryId: string, description: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            description,
          }
        }
        return category
      }),
    )
  }

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            isExpanded: !category.isExpanded,
          }
        }
        return category
      }),
    )
  }

  // Add a new category
  const addCategory = (parentId: string | null, level: CategoryLevel) => {
    const prefix = activeTab === "sales" ? "sales" : "exp"
    const newId = `${prefix}-${Date.now()}`
    const newCategory: CategoryItem = {
      id: newId,
      name: "New Category",
      level,
      parentId,
      values: {},
      isExpanded: true,
    }

    setCategories((prev) => [...prev, newCategory])

    // If we're adding a medium category, make sure its parent is expanded
    if (level === "medium" && parentId) {
      setCategories((prev) =>
        prev.map((category) => {
          if (category.id === parentId) {
            return {
              ...category,
              isExpanded: true,
            }
          }
          return category
        }),
      )
    }
  }

  // Delete a category and its children
  const deleteCategory = (categoryId: string) => {
    // Get all child categories recursively
    const getChildIds = (id: string): string[] => {
      const directChildren = categories.filter((c) => c.parentId === id).map((c) => c.id)
      const allChildren = [...directChildren]

      directChildren.forEach((childId) => {
        allChildren.push(...getChildIds(childId))
      })

      return allChildren
    }

    const childIds = getChildIds(categoryId)
    const idsToRemove = [categoryId, ...childIds]

    setCategories((prev) => prev.filter((category) => !idsToRemove.includes(category.id)))
  }

  // Update category name
  const updateCategoryName = (categoryId: string, newName: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            name: newName,
          }
        }
        return category
      }),
    )
  }

  const applyValueToAllMonths = (categoryId: string, value: number) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedValues = { ...category.values }
          months.forEach((month) => {
            updatedValues[month] = value
          })
          return {
            ...category,
            values: updatedValues,
          }
        }
        return category
      }),
    )
  }

  // Calculate totals for a category
  // Update the calculateTotal function to account for per-person calculations
  const calculateTotal = (categoryId: string, month: string | null = null): number => {
    // If it's a minor category, return its own value
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return 0

    if (category.level === "minor") {
      if (month) {
        // For per-person categories, multiply by headcount and multiplier
        if (category.perPerson && category.multiplier) {
          return (category.values[month] || 0) * (monthlyHeadcount[month] || 0) * category.multiplier
        }
        return category.values[month] || 0
      } else {
        // For total across all months
        if (category.perPerson && category.multiplier) {
          return Object.keys(category.values).reduce((sum, month) => {
            return sum + (category.values[month] || 0) * (monthlyHeadcount[month] || 0) * (category.multiplier || 1)
          }, 0)
        }
        return Object.values(category.values).reduce((sum, val) => sum + val, 0)
      }
    }

    // For major and medium categories, sum up all children
    const directChildren = categories.filter((c) => c.parentId === categoryId)

    if (directChildren.length === 0) {
      // No children, return its own value
      if (month) {
        return category.values[month] || 0
      } else {
        return Object.values(category.values).reduce((sum, val) => sum + val, 0)
      }
    }

    // Sum up all children
    return directChildren.reduce((sum, child) => {
      return sum + calculateTotal(child.id, month)
    }, 0)
  }

  // Get data for pie chart
  const getPieChartData = () => {
    if (pieChartLevel === "major") {
      // Get all major categories
      const majorCategories = categories.filter((c) => c.level === "major")
      return majorCategories.map((category) => ({
        name: category.name,
        value: calculateTotal(category.id),
      }))
    } else {
      // Get all medium categories
      const mediumCategories = categories.filter((c) => c.level === "medium")
      return mediumCategories.map((category) => ({
        name: category.name,
        value: calculateTotal(category.id),
      }))
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    // Create header row
    const csv = ["Category,Level," + months.join(",") + ",Total\n"]

    // Helper function to get category path
    const getCategoryPath = (categoryId: string): string => {
      const category = categories.find((c) => c.id === categoryId)
      if (!category) return ""

      if (!category.parentId) return category.name

      return `${getCategoryPath(category.parentId)} > ${category.name}`
    }

    // Add rows for each category
    categories.forEach((category) => {
      const levelIndent = category.level === "major" ? "" : category.level === "medium" ? "  " : "    "

      const categoryPath = levelIndent + category.name
      const levelName = category.level.charAt(0).toUpperCase() + category.level.slice(1)

      let row = `"${categoryPath}",${levelName},`

      // Add monthly values
      months.forEach((month) => {
        if (category.level === "minor") {
          row += `${category.values[month] || 0},`
        } else {
          row += `${calculateTotal(category.id, month)},`
        }
      })

      // Add total
      row += calculateTotal(category.id)

      csv.push(row + "\n")
    })

    // Create and trigger download
    const blob = new Blob([csv.join("")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${activeTab}_planning_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Save data in original JavaScript format
  const saveData = () => {
    try {
      // Convert categories to JSON
      const dataToSave = JSON.stringify(categories, null, 2)

      // Create and trigger download
      const blob = new Blob([dataToSave], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${activeTab}_planning_data_${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Data saved",
        description: `${categories.length} categories saved to JSON file`,
      })
    } catch (error) {
      console.error("Error saving data:", error)
      toast({
        title: "Save failed",
        description: "An error occurred while saving the data",
        variant: "destructive",
      })
    }
  }

  // Load data from JavaScript format
  const loadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content) {
          toast({
            title: "Error",
            description: "Could not read file content",
            variant: "destructive",
          })
          return
        }

        // Parse JSON
        const loadedData = JSON.parse(content) as CategoryItem[]

        // Validate data structure
        if (!Array.isArray(loadedData)) {
          toast({
            title: "Invalid data format",
            description: "The file does not contain valid planning data",
            variant: "destructive",
          })
          return
        }

        // Basic validation of each item
        const isValid = loadedData.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            "name" in item &&
            "level" in item &&
            ("parentId" in item || item.parentId === null) &&
            "values" in item,
        )

        if (!isValid) {
          toast({
            title: "Invalid data structure",
            description: "The file contains invalid category data",
            variant: "destructive",
          })
          return
        }

        // Update state with loaded data
        setCategories(loadedData)
        toast({
          title: "Data loaded",
          description: `Loaded ${loadedData.length} categories successfully`,
        })
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Load failed",
          description: "An error occurred while loading the data",
          variant: "destructive",
        })
      }

      // Reset file input
      if (jsonFileInputRef.current) {
        jsonFileInputRef.current.value = ""
      }
    }

    reader.readAsText(file)
  }

  // Import from CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content) {
          toast({
            title: "Error",
            description: "Could not read file content",
            variant: "destructive",
          })
          return
        }

        // Parse CSV
        const lines = content.split("\n").filter((line) => line.trim() !== "")
        const headers = lines[0].split(",")

        // Validate headers
        const monthColumns = headers.slice(2, 14)
        if (monthColumns.length !== 12) {
          toast({
            title: "Invalid CSV format",
            description: "CSV must contain 12 month columns",
            variant: "destructive",
          })
          return
        }

        // Create a map to store parent-child relationships
        const categoryMap = new Map<string, string>() // path -> id
        const newCategories: CategoryItem[] = []
        const prefix = activeTab === "sales" ? "sales" : "exp"

        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i]
          const columns = parseCSVLine(line)

          if (columns.length < 14) continue // Skip invalid lines

          const categoryPath = columns[0].trim()
          const level = columns[1].trim().toLowerCase() as CategoryLevel

          if (!["major", "medium", "minor"].includes(level)) continue // Skip invalid levels

          // Extract category name and determine parent path
          let categoryName = categoryPath
          let parentPath = null

          if (level === "medium") {
            categoryName = categoryName.trim()
            // Find the parent major category
            const parts = categoryPath.split(">")
            if (parts.length > 1) {
              parentPath = parts[0].trim()
              categoryName = parts[parts.length - 1].trim()
            }
          } else if (level === "minor") {
            categoryName = categoryName.trim()
            // Find the parent medium category
            const parts = categoryPath.split(">")
            if (parts.length > 2) {
              parentPath = `${parts[0].trim()} > ${parts[1].trim()}`
              categoryName = parts[parts.length - 1].trim()
            } else if (parts.length > 1) {
              parentPath = parts[0].trim()
              categoryName = parts[parts.length - 1].trim()
            }
          }

          // Generate a unique ID
          const id = `${prefix}-import-${Date.now()}-${i}`

          // Find parent ID
          let parentId = null
          if (parentPath) {
            parentId = categoryMap.get(parentPath) || null
          }

          // Store this category's path -> id mapping
          categoryMap.set(categoryPath, id)

          // Create values object
          const values: Record<string, number> = {}
          for (let j = 0; j < 12; j++) {
            const monthValue = Number.parseFloat(columns[j + 2])
            if (!isNaN(monthValue)) {
              values[months[j]] = monthValue
            }
          }

          // Create category object
          const category: CategoryItem = {
            id,
            name: categoryName,
            level,
            parentId,
            values,
            isExpanded: true,
          }

          newCategories.push(category)
        }

        // Update state with new categories
        if (newCategories.length > 0) {
          setCategories(newCategories)
          toast({
            title: "Import successful",
            description: `Imported ${newCategories.length} categories`,
          })
        } else {
          toast({
            title: "Import failed",
            description: "No valid categories found in CSV",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error importing CSV:", error)
        toast({
          title: "Import failed",
          description: "An error occurred while importing the CSV file",
          variant: "destructive",
        })
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsText(file)
  }

  // Helper function to parse CSV line properly (handling quoted fields)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }

    // Add the last field
    result.push(current)
    return result
  }

  // Render the spreadsheet
  const renderCategories = () => {
    // Filter top-level categories
    const topLevelCategories = categories.filter((c) => c.parentId === null)

    const renderCategory = (category: CategoryItem, depth = 0) => {
      const children = categories.filter((c) => c.parentId === category.id)
      const hasChildren = children.length > 0
      const isExpandable = category.level !== "minor"

      return (
        <div key={category.id}>
          <div
            className={`grid grid-cols-[300px_repeat(13,1fr)_1fr] items-center border-b ${
              category.level === "major"
                ? "bg-muted/30 font-semibold"
                : category.level === "medium"
                  ? "bg-muted/10"
                  : ""
            }`}
          >
            <div className="flex items-center p-2 gap-2">
              {isExpandable && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="w-5 h-5 flex items-center justify-center text-muted-foreground"
                >
                  {category.isExpanded ? "−" : "+"}
                </button>
              )}
              <div style={{ marginLeft: `${depth * 16}px` }} className="flex-1">
                <Input
                  value={category.name}
                  onChange={(e) => updateCategoryName(category.id, e.target.value)}
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {/* Update the minor category controls to include per-person toggle */}
              {category.level === "minor" && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>説明：{category.name}</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        placeholder="Enter a description for this category..."
                        value={category.description || ""}
                        onChange={(e) => updateCategoryDescription(category.id, e.target.value)}
                        className="min-h-[150px]"
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => {
                      const value = window.prompt("Enter value to apply to all months:", "0")
                      if (value !== null) {
                        const numValue = Number.parseFloat(value)
                        if (!isNaN(numValue)) {
                          applyValueToAllMonths(category.id, numValue)
                        }
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={category.perPerson ? "default" : "ghost"}
                        size="sm"
                        className={`h-6 text-xs ${category.perPerson ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      >
                        {category.perPerson ? `${category.multiplier}x/person` : "x人"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Per-Person Cost Settings</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePerPersonCategory(category.id)}
                            className="text-xs"
                          >
                            {category.perPerson ? "Disable" : "Enable"}
                          </Button>
                        </div>
                        {category.perPerson && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label htmlFor="multiplier" className="text-sm">
                                Multiplier:
                              </label>
                              <Input
                                id="multiplier"
                                type="number"
                                value={category.multiplier || 1}
                                onChange={(e) => updateCategoryMultiplier(category.id, Number(e.target.value) || 1)}
                                className="w-24"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Formula: Base Cost × Headcount × Multiplier
                            </div>
                            <div className="text-xs">
                              Example: ${category.values["January"] || 0} × {monthlyHeadcount["January"] || 0} ×{" "}
                              {category.multiplier || 1} = $
                              {(
                                (category.values["January"] || 0) *
                                (monthlyHeadcount["January"] || 0) *
                                (category.multiplier || 1)
                              ).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => deleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Monthly values */}
            {months.map((month) => (
              <div key={month} className="p-1">
                {category.level === "minor" ? (
                  <Input
                    type="number"
                    value={category.values[month] || ""}
                    onChange={(e) => handleValueChange(category.id, month, e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <div className="text-right p-2 font-medium">
                    {calculateTotal(category.id, month).toLocaleString()}
                  </div>
                )}
              </div>
            ))}

            {/* Total column */}
            <div className="p-1 font-medium text-right">{calculateTotal(category.id).toLocaleString()}</div>

            {/* Remove the Per Person column at the end of the renderCategory function: */}
          </div>

          {/* Render children if expanded */}
          {(
            <div>
              {children.map((child) => renderCategory(child, depth + 1))}

              {/* Add button for next level */}
              {category.level === "major" && (
                <div className="pl-8 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => addCategory(category.id, "medium")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    中分類追加
                  </Button>
                </div>
              )}

              {category.level === "medium" && (
                <div className="pl-12 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => addCategory(category.id, "minor")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    小分類追加
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div>
        {topLevelCategories.map((category) => renderCategory(category))}
        <div className="py-2">
          <Button variant="outline" onClick={() => addCategory(null, "major")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Major Category
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sales" | "expenses")}>
        <div className="flex justify-between items-center p-4 border-b">
          <TabsList>
            <TabsTrigger value="sales">売上</TabsTrigger>
            <TabsTrigger value="expenses">経費</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <input type="file" accept=".csv" onChange={importFromCSV} ref={fileInputRef} className="hidden" />
            <input type="file" accept=".json" onChange={loadData} ref={jsonFileInputRef} className="hidden" />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  グラフ表示
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px]" align="end">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">カテゴリー分布</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={pieChartLevel === "major" ? "default" : "outline"}
                        onClick={() => setPieChartLevel("major")}
                      >
                        大分類
                      </Button>
                      <Button
                        size="sm"
                        variant={pieChartLevel === "medium" ? "default" : "outline"}
                        onClick={() => setPieChartLevel("medium")}
                      >
                        中分類
                      </Button>
                    </div>
                  </div>
                  <CategoryPieChart data={getPieChartData()} />
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={() => jsonFileInputRef.current?.click()} variant="outline">
              <FileUp className="h-4 w-4 mr-2" />
              データ読込
            </Button>
            <Button onClick={saveData} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              データ保存
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              CSV取込
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              CSV出力
            </Button>
          </div>
        </div>

        <div className="p-4 border-b bg-muted/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">月別人員数：</h3>
              <div className="text-sm text-muted-foreground">（一人当たりのコスト計算に使用）</div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              {months.map((month) => (
                <div key={month} className="flex flex-col items-center">
                  <label htmlFor={`headcount-${month}`} className="text-xs font-medium">
                    {month.substring(0, 3)}
                  </label>
                  <Input
                    id={`headcount-${month}`}
                    type="number"
                    value={monthlyHeadcount[month] || ""}
                    onChange={(e) => updateMonthlyHeadcount(month, e.target.value)}
                    className="w-full h-8 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <CardContent className="p-0 overflow-auto">
          <TabsContent value="sales" className="m-0">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[300px_repeat(13,1fr)_1fr] bg-muted/50 font-semibold border-b sticky top-0">
                <div className="p-3">カテゴリー</div>
                {months.map((month) => (
                  <div key={month} className="p-3 text-center">
                    {month.substring(0, 3)}
                  </div>
                ))}
                <div className="p-3 text-center">合計</div>
              </div>

              {renderCategories()}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="m-0">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[300px_repeat(13,1fr)_1fr] bg-muted/50 font-semibold border-b sticky top-0">
                <div className="p-3">カテゴリー</div>
                {months.map((month) => (
                  <div key={month} className="p-3 text-center">
                    {month.substring(0, 3)}
                  </div>
                ))}
                <div className="p-3 text-center">合計</div>
              </div>

              {renderCategories()}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
