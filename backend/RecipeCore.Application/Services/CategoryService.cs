using RecipeCore.Application.Interfaces;
using RecipeCore.Domain.Entities;

namespace RecipeCore.Application.Services;

public class CategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Category> CreateCategoryAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty");

        if (await _unitOfWork.Categories.CategoryNameExistsAsync(name))
            throw new InvalidOperationException($"Category with name '{name}' already exists");

        var category = new Category
        {
            CategoryId = Guid.NewGuid(),
            Name = name
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return category;
    }

    public async Task<Category> UpdateCategoryAsync(Guid categoryId, string name)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null)
            throw new InvalidOperationException("Category not found");

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty");

        var existingCategory = await _unitOfWork.Categories.GetByNameAsync(name);
        if (existingCategory != null && existingCategory.CategoryId != categoryId)
            throw new InvalidOperationException($"Category with name '{name}' already exists");

        category.Name = name;
        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return category;
    }

    public async Task DeleteCategoryAsync(Guid categoryId)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null)
            throw new InvalidOperationException("Category not found");

        await _unitOfWork.Categories.DeleteAsync(category);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(Guid categoryId)
    {
        return await _unitOfWork.Categories.GetByIdAsync(categoryId);
    }

    public async Task<Category?> GetCategoryByNameAsync(string name)
    {
        return await _unitOfWork.Categories.GetByNameAsync(name);
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _unitOfWork.Categories.GetAllAsync();
    }
}
