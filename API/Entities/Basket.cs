using System.Collections.Generic;

namespace API.Entities
{
    public class Basket {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();
        //public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public void AddItem(Product product, int quantity) {

            if (Items.All(item => item.ProductId != product.Id)) {
                Items.Add(new BasketItem{Product = product, Quantity = quantity});
            }

            var existingItem = Items.FirstOrDefault(Item => Item.ProductId == product.Id);
            if (existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity) {
            
            var Item = Items.FirstOrDefault(item => item.ProductId == productId);
            if (Item != null) {
                if (Item.Quantity <= quantity) Item.Quantity = 0;
                else Item.Quantity -= quantity;
            }
            if (Item.Quantity == 0) Items.Remove(Item);
        }
    }

}
