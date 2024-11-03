import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Marketer } from 'src/app/core/models/marketer.model';
import { Option } from 'src/app/core/models/option.model';
import { Product } from 'src/app/core/models/product.model';

export function productToOption(product?: Product): Option<Product> {
  if (!product) return null;

  return {
    label: product.name,
    value: product,
  };
}

export function serviceProviderToOption(
  serviceProvider?: ServiceProvider
): Option<ServiceProvider> {
  if (!serviceProvider) return null;
  return {
    label: serviceProvider.name,
    value: serviceProvider,
  };
}

export function marketerToOption(marketer): Option<Marketer> {
  if (!marketer) return null;
  return {
    label: marketer.name,
    value: marketer,
  };
}
