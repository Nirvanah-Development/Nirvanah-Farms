'use client'

import React, { useState, useEffect } from 'react'
import { writeClient } from '../lib/client'
import { 
  Card,
  Container,
  Stack,
  Button,
  Text,
  Box,
  Grid,
  Flex,
  Checkbox,
  Select,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  Badge,
  Spinner,
  useToast
} from '@sanity/ui'
import { 
  AddIcon, 
  EllipsisVerticalIcon,
  EditIcon,
  TrashIcon
} from '@sanity/icons'

interface Office {
  _id: string
  _type: string
  officeName: string
  location: string
  locationUrl?: string
  officeCode: string
  employees: number
  charitable: number
  orders: string
  target: string
  status: 'gifted' | 'processing' | 'donated' | 'target_filled'
  shipDate: string
  image?: {
    asset: {
      _ref: string
      url: string
    }
  }
  description?: string
  isActive: boolean
}

export function OfficeManagement() {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [officeToDelete, setOfficeToDelete] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    fetchOffices()
  }, [])

  const fetchOffices = async () => {
    try {
      setLoading(true)
      const query = `*[_type == "office"] | order(officeName asc) {
        _id,
        _type,
        officeName,
        location,
        locationUrl,
        officeCode,
        employees,
        charitable,
        orders,
        target,
        status,
        shipDate,
        image {
          asset-> {
            _ref,
            url
          }
        },
        description,
        isActive
      }`
      
      const result = await writeClient.fetch(query)
      setOffices(result)
    } catch (error) {
      console.error('Error fetching offices:', error)
      toast.push({
        status: 'error',
        title: 'Error fetching offices',
        description: 'Failed to load office data'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOffices(new Set())
    } else {
      setSelectedOffices(new Set(offices.map(office => office._id)))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOffice = (officeId: string) => {
    const newSelected = new Set(selectedOffices)
    if (newSelected.has(officeId)) {
      newSelected.delete(officeId)
    } else {
      newSelected.add(officeId)
    }
    setSelectedOffices(newSelected)
    setSelectAll(newSelected.size === offices.length)
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOffices.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedOffices).map(officeId => 
          writeClient.patch(officeId).set({ status: bulkAction }).commit()
        )
      )

      toast.push({
        status: 'success',
        title: 'Bulk action completed',
        description: `Updated ${selectedOffices.size} offices to ${bulkAction}`
      })

      fetchOffices()
      setSelectedOffices(new Set())
      setSelectAll(false)
      setBulkAction('')
    } catch (error) {
      console.error('Error applying bulk action:', error)
      toast.push({
        status: 'error',
        title: 'Bulk action failed',
        description: 'Failed to update office statuses'
      })
    }
  }

  const handleDeleteOffice = async (officeId: string) => {
    try {
      await writeClient.delete(officeId)
      toast.push({
        status: 'success',
        title: 'Office deleted',
        description: 'Office has been successfully deleted'
      })
      fetchOffices()
      setShowDeleteDialog(false)
      setOfficeToDelete(null)
    } catch (error) {
      console.error('Error deleting office:', error)
      toast.push({
        status: 'error',
        title: 'Delete failed',
        description: 'Failed to delete office'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gifted': return 'primary'
      case 'processing': return 'warning'  
      case 'donated': return 'positive'
      case 'target_filled': return 'caution'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <Container width={5} padding={4}>
        <Flex align="center" justify="center" padding={6}>
          <Spinner muted />
        </Flex>
      </Container>
    )
  }

  return (
    <Container width={5} padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Text size={3} weight="semibold">All Partner Offices</Text>
          <Button
            icon={AddIcon}
            text="+ Add New"
            tone="primary"
            onClick={() => {
              window.open('/17448/desk/office;type=office;template=office', '_blank')
            }}
          />
        </Flex>

        {/* Bulk Actions */}
        <Card padding={3} tone="transparent">
          <Flex align="center" gap={3}>
            <Select
              value={bulkAction}
              onChange={(event) => setBulkAction(event.currentTarget.value)}
              placeholder="Bulk Actions"
              disabled={selectedOffices.size === 0}
              fontSize={1}
            >
              <option value="">Bulk Actions</option>
              <option value="gifted">1. Change Status to Gifted</option>
              <option value="processing">2. Change Status to Processing</option>
              <option value="donated">3. Change Status to Donated</option>
            </Select>
            <Button
              text="Apply"
              tone="primary"
              disabled={!bulkAction || selectedOffices.size === 0}
              onClick={handleBulkAction}
            />
            {selectedOffices.size > 0 && (
              <Text size={1} muted>
                {selectedOffices.size} office{selectedOffices.size !== 1 ? 's' : ''} selected
              </Text>
            )}
          </Flex>
        </Card>

        {/* Table */}
        <Card>
          <Box padding={3}>
            {/* Table Header */}
            <Grid columns={[1, 1, 11]} gap={2} style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '8px' }}>
              <Flex align="center">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </Flex>
              <Text size={1} weight="semibold">office name</Text>
              <Text size={1} weight="semibold">Location</Text>
              <Text size={1} weight="semibold">employee</Text>
              <Text size={1} weight="semibold">charitable</Text>
              <Text size={1} weight="semibold">office code</Text>
              <Text size={1} weight="semibold">orders</Text>
              <Text size={1} weight="semibold">target</Text>
              <Text size={1} weight="semibold">status</Text>
              <Text size={1} weight="semibold">ship date</Text>
              <Box />
            </Grid>

            {/* Table Body */}
            <Stack space={1} paddingTop={3}>
              {offices.map((office) => (
                <Grid key={office._id} columns={[1, 1, 11]} gap={2} padding={2} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
                  <Flex align="center">
                    <Checkbox
                      checked={selectedOffices.has(office._id)}
                      onChange={() => handleSelectOffice(office._id)}
                    />
                  </Flex>
                  <Flex align="center" gap={2}>
                    {office.image?.asset?.url && (
                      <Box style={{ width: 24, height: 24, borderRadius: 4, overflow: 'hidden' }}>
                        <img src={office.image.asset.url} alt={office.officeName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    )}
                    <Text size={1}>{office.officeName}</Text>
                  </Flex>
                  <Text size={1}>{office.location}</Text>
                  <Text size={1}>{office.employees}</Text>
                  <Text size={1}>{office.charitable}</Text>
                  <Text size={1}>{office.officeCode}</Text>
                  <Text size={1}>{office.orders}</Text>
                  <Text size={1}>{office.target}</Text>
                  <Badge tone={getStatusColor(office.status)} fontSize={0}>
                    {office.status === 'target_filled' ? 'Target filled' : 
                     office.status.charAt(0).toUpperCase() + office.status.slice(1)}
                  </Badge>
                  <Text size={1}>{formatDate(office.shipDate)}</Text>
                  <Menu>
                    <MenuButton
                      button={
                        <Button
                          icon={EllipsisVerticalIcon}
                          mode="ghost"
                          padding={2}
                        />
                      }
                      id={`office-menu-${office._id}`}
                      portal
                    />
                    <MenuItem
                      text="Edit"
                      icon={EditIcon}
                      onClick={() => {
                        window.open(`/17448/desk/office;${office._id}`, '_blank')
                      }}
                    />
                    <MenuItem
                      text="Delete"
                      icon={TrashIcon}
                      tone="critical"
                      onClick={() => {
                        setOfficeToDelete(office._id)
                        setShowDeleteDialog(true)
                      }}
                    />
                  </Menu>
                </Grid>
              ))}
            </Stack>

            {offices.length === 0 && (
              <Flex align="center" justify="center" padding={6}>
                <Text muted>No offices found. Click "Add New" to create your first office.</Text>
              </Flex>
            )}
          </Box>
        </Card>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <Dialog
            header="Delete Office"
            id="delete-office-dialog"
            onClose={() => {
              setShowDeleteDialog(false)
              setOfficeToDelete(null)
            }}
            footer={
              <Box padding={3}>
                <Flex gap={2} justify="flex-end">
                  <Button
                    text="Cancel"
                    mode="ghost"
                    onClick={() => {
                      setShowDeleteDialog(false)
                      setOfficeToDelete(null)
                    }}
                  />
                  <Button
                    text="Delete"
                    tone="critical"
                    onClick={() => officeToDelete && handleDeleteOffice(officeToDelete)}
                  />
                </Flex>
              </Box>
            }
          >
            <Box padding={4}>
              <Text>Are you sure you want to delete this office? This action cannot be undone.</Text>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Container>
  )
} 