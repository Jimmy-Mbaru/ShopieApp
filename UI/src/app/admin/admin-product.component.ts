import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  newProduct: Partial<Product> = {
    name: '',
    description: '',
    price: undefined,
    totalStock: undefined
  };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  editingProductId: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : data.products;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editProduct(product: Product): void {
    this.editingProductId = product.id;
    this.newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      totalStock: product.totalStock
    };
    this.imagePreview = product.image;
    this.selectedFile = null; // Reset file since it's optional during edit
  }

  addProduct(): void {
    const { name, description, price, totalStock } = this.newProduct;

    if (!name || !description || price === undefined || totalStock === undefined) {
      alert('Please fill in all fields.');
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(totalStock);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Price must be a positive number.');
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('Stock must be zero or more.');
      return;
    }

    if (this.editingProductId) {
      const updatedProduct = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        totalStock: parsedStock
      };

      this.productService.update(this.editingProductId, updatedProduct).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to update product:', err);
          alert(err?.error?.message || 'Update failed.');
        }
      });

      return;
    }


    // Add logic
    if (!this.selectedFile) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', parsedPrice.toString());
    formData.append('totalStock', parsedStock.toString());
    formData.append('image', this.selectedFile);

    this.productService.create(formData).subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to create product:', err);
        const messages = err?.error?.message;
        alert(Array.isArray(messages) ? messages.join('\n') : messages || 'Failed to add product.');
      }
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        console.error('Failed to delete product:', err);
        alert(err?.error?.message || 'Delete failed.');
      }
    });
  }

  private resetForm(): void {
    this.newProduct = { name: '', description: '', price: undefined, totalStock: undefined };
    this.selectedFile = null;
    this.imagePreview = null;
    this.editingProductId = null;
  }
}
