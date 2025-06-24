import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Audi Q5',
      description: 'Luxury compact SUV with premium features and Quattro all-wheel drive.',
      price: 66599.99,
      image: 'src/assets/product-images/AudiQ5_result.jpg',
      inStock: 10
    },
    {
      id: 2,
      name: 'Audi S5',
      description: 'High-performance luxury coupe with turbocharged V6 and sporty handling.',
      price: 111199.99,
      image: 'assets/product-images/Audi S5_result.jpg',
      inStock: 5
    },
    {
      id: 3,
      name: 'BMW F9',
      description: 'High-performance luxury vehicle with advanced engineering and dynamic driving experience',
      price: 77749.99,
      image: 'assets/product-images/BMW F9_result.jpg',
      inStock: 7
    },

    {
      id: 4,
      name: 'BMW X6',
      description: 'Sporty luxury SUV-coupe crossover with bold, distinctive sloping roofline',
      price: 80749.99,
      image: 'assets/product-images/BMW X6_result.jpg',
      inStock: 10
    },

    {
      id: 5,
      name: 'Mercedes E63',
      description: 'High-performance luxury sedan with AMG twin-turbo V8 engine power.',
      price: 90749.99,
      image: 'assets/product-images/E63_result.jpg',
      inStock: 7
    },

    {
      id: 6,
      name: 'Mercedes G-wagon',
      description: ' luxury SUV with rugged off-road capability and premium interior',
      price: 100000.99,
      image: 'assets/product-images/G-Wagon_result.jpg',
      inStock: 5
    },

    {
      id: 7,
      name: 'Porsche GT3 RS',
      description: 'Track-focused sports car with naturally aspirated engine and aerodynamic enhancements',
      price: 200000.99,
      image: 'assets/product-images/GT3 RS_result.jpg',
      inStock: 10
    },

    {
      id: 8,
      name: 'Porsche Cayene',
      description: 'Luxury performance SUV combining Porsche sports car DNA with practicality',
      price: 70000.99,
      image: 'assets/product-images/PCayene_result.jpg',
      inStock: 7
    }

  ];

  addToCart(product: Product): void {
    console.log('Added to cart:', product);
  }
}
