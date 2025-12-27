// Wishlist Application
class WishlistApp {
  constructor() {
    this.items = this.loadFromLocalStorage()
    this.editingItemId = null
    this.initializeElements()
    this.attachEventListeners()
    this.render()
  }

  // Initialize DOM elements
  initializeElements() {
    // Form elements
    this.form = document.getElementById("wishlistForm")
    this.itemNameInput = document.getElementById("itemName")
    this.itemPriceInput = document.getElementById("itemPrice")
    this.itemCategoryInput = document.getElementById("itemCategory")
    this.itemPriorityInput = document.getElementById("itemPriority")
    this.itemNotesInput = document.getElementById("itemNotes")
    this.submitBtn = document.getElementById("submitBtn")
    this.submitBtnText = document.getElementById("submitBtnText")

    // Display elements
    this.wishlistItems = document.getElementById("wishlistItems")
    this.emptyState = document.getElementById("emptyState")
    this.totalItemsEl = document.getElementById("totalItems")
    this.purchasedItemsEl = document.getElementById("purchasedItems")
    this.totalValueEl = document.getElementById("totalValue")

    // Control elements
    this.searchInput = document.getElementById("searchInput")
    this.filterCategory = document.getElementById("filterCategory")
    this.filterStatus = document.getElementById("filterStatus")
    this.sortBy = document.getElementById("sortBy")
    this.clearAllBtn = document.getElementById("clearAllBtn")

    // Modal elements
    this.editModal = document.getElementById("editModal")
    this.editForm = document.getElementById("editForm")
    this.closeModal = document.getElementById("closeModal")
    this.cancelEdit = document.getElementById("cancelEdit")
    this.editItemId = document.getElementById("editItemId")
    this.editItemName = document.getElementById("editItemName")
    this.editItemPrice = document.getElementById("editItemPrice")
    this.editItemCategory = document.getElementById("editItemCategory")
    this.editItemPriority = document.getElementById("editItemPriority")
    this.editItemNotes = document.getElementById("editItemNotes")

    // Toast
    this.toast = document.getElementById("toast")
  }

  // Attach event listeners
  attachEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))

    // Search and filters
    this.searchInput.addEventListener("input", () => this.render())
    this.filterCategory.addEventListener("change", () => this.render())
    this.filterStatus.addEventListener("change", () => this.render())
    this.sortBy.addEventListener("change", () => this.render())

    // Clear all
    this.clearAllBtn.addEventListener("click", () => this.clearAll())

    // Modal
    this.closeModal.addEventListener("click", () => this.closeEditModal())
    this.cancelEdit.addEventListener("click", () => this.closeEditModal())
    this.editModal.addEventListener("click", (e) => {
      if (e.target === this.editModal) {
        this.closeEditModal()
      }
    })
    this.editForm.addEventListener("submit", (e) => this.handleEdit(e))
  }

  // Create new item
  createItem(name, price, category, priority, notes) {
    return {
      id: Date.now().toString(),
      name,
      price: Number.parseFloat(price),
      category,
      priority,
      notes,
      purchased: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault()

    const name = this.itemNameInput.value.trim()
    const price = this.itemPriceInput.value
    const category = this.itemCategoryInput.value
    const priority = this.itemPriorityInput.value
    const notes = this.itemNotesInput.value.trim()

    if (!name || !price) {
      this.showToast("Nama dan harga barang harus diisi!", "error")
      return
    }

    const newItem = this.createItem(name, price, category, priority, notes)
    this.items.unshift(newItem)
    this.saveToLocalStorage()
    this.render()
    this.form.reset()
    this.showToast("Barang berhasil ditambahkan!", "success")
  }

  // Delete item
  deleteItem(id) {
    if (confirm("Yakin ingin menghapus barang ini?")) {
      this.items = this.items.filter((item) => item.id !== id)
      this.saveToLocalStorage()
      this.render()
      this.showToast("Barang berhasil dihapus!", "success")
    }
  }

  // Toggle purchase status
  togglePurchase(id) {
    const item = this.items.find((item) => item.id === id)
    if (item) {
      item.purchased = !item.purchased
      item.updatedAt = new Date().toISOString()
      this.saveToLocalStorage()
      this.render()
      const status = item.purchased ? "sudah dibeli" : "belum dibeli"
      this.showToast(`Status barang diubah menjadi ${status}!`, "success")
    }
  }

  // Open edit modal
  openEditModal(id) {
    const item = this.items.find((item) => item.id === id)
    if (item) {
      this.editItemId.value = item.id
      this.editItemName.value = item.name
      this.editItemPrice.value = item.price
      this.editItemCategory.value = item.category
      this.editItemPriority.value = item.priority
      this.editItemNotes.value = item.notes
      this.editModal.classList.add("show")
    }
  }

  // Close edit modal
  closeEditModal() {
    this.editModal.classList.remove("show")
    this.editForm.reset()
  }

  // Handle edit
  handleEdit(e) {
    e.preventDefault()

    const id = this.editItemId.value
    const item = this.items.find((item) => item.id === id)

    if (item) {
      item.name = this.editItemName.value.trim()
      item.price = Number.parseFloat(this.editItemPrice.value)
      item.category = this.editItemCategory.value
      item.priority = this.editItemPriority.value
      item.notes = this.editItemNotes.value.trim()
      item.updatedAt = new Date().toISOString()

      this.saveToLocalStorage()
      this.render()
      this.closeEditModal()
      this.showToast("Barang berhasil diupdate!", "success")
    }
  }

  // Clear all items
  clearAll() {
    if (this.items.length === 0) {
      this.showToast("Tidak ada barang untuk dihapus!", "error")
      return
    }

    if (confirm("Yakin ingin menghapus semua barang?")) {
      this.items = []
      this.saveToLocalStorage()
      this.render()
      this.showToast("Semua barang berhasil dihapus!", "success")
    }
  }

  // Filter and sort items
  getFilteredAndSortedItems() {
    let filtered = [...this.items]

    // Search filter
    const searchTerm = this.searchInput.value.toLowerCase()
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.notes.toLowerCase().includes(searchTerm),
      )
    }

    // Category filter
    const categoryFilter = this.filterCategory.value
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Status filter
    const statusFilter = this.filterStatus.value
    if (statusFilter === "pending") {
      filtered = filtered.filter((item) => !item.purchased)
    } else if (statusFilter === "purchased") {
      filtered = filtered.filter((item) => item.purchased)
    }

    // Sort
    const sortOption = this.sortBy.value
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "price-high":
          return b.price - a.price
        case "price-low":
          return a.price - b.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }

  // Render items
  render() {
    const filtered = this.getFilteredAndSortedItems()

    // Update stats
    this.updateStats()

    // Show/hide empty state
    if (filtered.length === 0) {
      this.wishlistItems.style.display = "none"
      this.emptyState.classList.add("show")
      return
    }

    this.wishlistItems.style.display = "grid"
    this.emptyState.classList.remove("show")

    // Render items
    this.wishlistItems.innerHTML = filtered.map((item) => this.renderItem(item)).join("")

    // Attach item event listeners
    this.attachItemEventListeners()
  }

  // Render single item
  renderItem(item) {
    const date = new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const priorityClass = item.priority === "Tinggi" ? "high" : item.priority === "Sedang" ? "medium" : "low"

    const purchaseText = item.purchased ? "✓ Sudah Dibeli" : "Tandai Dibeli"
    const purchaseClass = item.purchased ? "purchased" : ""

    return `
            <div class="item-card ${item.purchased ? "purchased" : ""}" data-id="${item.id}">
                <div class="item-header">
                    <div class="item-info">
                        <h3 class="item-name">${this.escapeHtml(item.name)}</h3>
                        <p class="item-price">${this.formatCurrency(item.price)}</p>
                    </div>
                    <div class="item-badges">
                        <span class="badge badge-category">${item.category}</span>
                        <span class="badge badge-priority ${priorityClass}">${item.priority}</span>
                    </div>
                </div>
                <div class="item-details">
                    ${item.notes ? `<p class="item-notes">${this.escapeHtml(item.notes)}</p>` : ""}
                    <p class="item-date">Ditambahkan: ${date}</p>
                </div>
                <div class="item-actions">
                    <button class="action-btn btn-purchase ${purchaseClass}" data-action="purchase" data-id="${item.id}">
                        ${purchaseText}
                    </button>
                    <button class="action-btn btn-edit" data-action="edit" data-id="${item.id}">
                        Edit
                    </button>
                    <button class="action-btn btn-delete" data-action="delete" data-id="${item.id}">
                        Hapus
                    </button>
                </div>
            </div>
        `
  }

  // Attach event listeners to item buttons
  attachItemEventListeners() {
    const buttons = this.wishlistItems.querySelectorAll("[data-action]")
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action
        const id = e.currentTarget.dataset.id

        switch (action) {
          case "purchase":
            this.togglePurchase(id)
            break
          case "edit":
            this.openEditModal(id)
            break
          case "delete":
            this.deleteItem(id)
            break
        }
      })
    })
  }

  // Update statistics
  updateStats() {
    const total = this.items.length
    const purchased = this.items.filter((item) => item.purchased).length
    const totalValue = this.items.reduce((sum, item) => sum + item.price, 0)

    this.totalItemsEl.textContent = total
    this.purchasedItemsEl.textContent = purchased
    this.totalValueEl.textContent = this.formatCurrency(totalValue)
  }

  // Show toast notification
  showToast(message, type = "success") {
    this.toast.textContent = message
    this.toast.className = `toast ${type} show`

    setTimeout(() => {
      this.toast.classList.remove("show")
    }, 3000)
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  // Local storage methods
  saveToLocalStorage() {
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(this.items))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      this.showToast("Gagal menyimpan data!", "error")
    }
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem("wishlistItems")
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error loading from localStorage:", error)
      return []
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new WishlistApp()
})
