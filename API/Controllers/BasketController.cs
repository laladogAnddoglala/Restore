using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // [Route("api/[controller]")]
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            return new BasketDto {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto{
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
                                                                                        
        [HttpPost]  // api/basket?productId=3&quantity=2
        public async Task<ActionResult> AddItemToBasket(int productid, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();
            var product = await _context.Products.FindAsync(productid);
            if (product == null) return NotFound(); 
            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);
            return BadRequest(new ProblemDetails{Title = "Problem occur when saving Item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productiD, int quantity)
        {

            return Ok();
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(b => b.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential =true, Expires = DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

    }
}