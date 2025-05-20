import express, { Request, Response } from 'express';
import { articles, journalists, categories } from './data'; // Import the dummy data
import { Article, Journalist, Category } from './models/data'; // Import the types


const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// --- Article Controller ---
const articleController = {
    getAllArticles: (req: Request, res: Response) => {
        res.status(200).json(articles);
    },

    getArticleById: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const article = articles.find(a => a.id === id);

        if (article) {
            res.status(200).json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    },

    createArticle: (req: Request, res: Response) => {
        const { title, content, journalistId, categoryId } = req.body;

        // Basic validation (you'd add more robust validation in a real app)
        if (!title || !content || !journalistId || !categoryId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newArticle: Article = {
            id: articles.length + 1, // Simple ID generation (in real app, use a proper ID generator)
            title,
            content,
            journalistId,
            categoryId
        };

        articles.push(newArticle);
        res.status(201).json(newArticle); // 201 Created, send back the new resource
    },

    updateArticle: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { title, content, journalistId, categoryId } = req.body;

        const articleIndex = articles.findIndex(a => a.id === id);

        if (articleIndex > -1) {
            articles[articleIndex] = {
                ...articles[articleIndex], // Spread existing properties
                title: title ?? articles[articleIndex].title,
                content: content ?? articles[articleIndex].content,
                journalistId: journalistId ?? articles[articleIndex].journalistId,
                categoryId: categoryId ?? articles[articleIndex].categoryId
            };
            res.status(200).json(articles[articleIndex]);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    },

    deleteArticle: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const articleIndex = articles.findIndex(a => a.id === id);

        if (articleIndex > -1) {
            articles.splice(articleIndex, 1); // Remove the article
            res.status(204).send();       // 204 No Content (successful deletion)
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    }
};

// --- Journalist Controller ---
const journalistController = {
    getAllJournalists: (req: Request, res: Response) => {
        res.status(200).json(journalists);
    },

    getJournalistById: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const journalist = journalists.find(j => j.id === id);

        if (journalist) {
            res.status(200).json(journalist);
        } else {
            res.status(404).json({ message: 'Journalist not found' });
        }
    },

    createJournalist: (req: Request, res: Response) => {
        const { name, email } = req.body;

        if (!name || !email) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const newJournalist: Journalist = {
            id: journalists.length + 1,
            name,
            email
        };

        journalists.push(newJournalist);
        res.status(201).json(newJournalist);
    },

    updateJournalist: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name, email } = req.body;
        const journalistIndex = journalists.findIndex(j => j.id === id);

        if (journalistIndex > -1) {
            journalists[journalistIndex] = {
                ...journalists[journalistIndex],
                name: name ?? journalists[journalistIndex].name,
                email: email ?? journalists[journalistIndex].email
            };
            res.status(200).json(journalists[journalistIndex]);
        } else {
            res.status(404).json({ message: 'Journalist not found' });
        }
    },

    deleteJournalist: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const journalistIndex = journalists.findIndex(j => j.id === id);

        if (journalistIndex > -1) {
            journalists.splice(journalistIndex, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Journalist not found' });
        }
    },

    getArticlesByJournalist: (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const journalistArticles = articles.filter(article => article.journalistId === id);
      if(journalistArticles.length > 0){
        res.status(200).json(journalistArticles);
      } else {
        res.status(404).json({ message: 'No articles found for this journalist' });
      }
    }
};

// --- Category Controller ---
const categoryController = {
    getAllCategories: (req: Request, res: Response) => {
        res.status(200).json(categories);
    },

    getCategoryById: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const category = categories.find(c => c.id === id);

        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    },

    createCategory: (req: Request, res: Response) => {
        const { name } = req.body;
         if (!name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newCategory: Category = {
            id: categories.length + 1,
            name
        };

        categories.push(newCategory);
        res.status(201).json(newCategory);
    },

    updateCategory: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const categoryIndex = categories.findIndex(c => c.id === id);

        if (categoryIndex > -1) {
            categories[categoryIndex] = {
                ...categories[categoryIndex],
                name: name ?? categories[categoryIndex].name
            };
            res.status(200).json(categories[categoryIndex]);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    },

    deleteCategory: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const categoryIndex = categories.findIndex(c => c.id === id);

        if (categoryIndex > -1) {
            categories.splice(categoryIndex, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    },
    getArticlesByCategory: (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const categoryArticles = articles.filter(article => article.categoryId === id);
         if(categoryArticles.length > 0){
          res.status(200).json(categoryArticles);
        } else {
          res.status(404).json({ message: 'No articles found for this category' });
        }
    }
};

// --- Routes ---
// Article routes
app.get('/articles', articleController.getAllArticles);
app.get('/articles/:id', articleController.getArticleById);
app.post('/articles', articleController.createArticle);
app.put('/articles/:id', articleController.updateArticle);
app.delete('/articles/:id', articleController.deleteArticle);

// Journalist routes
app.get('/journalists', journalistController.getAllJournalists);
app.get('/journalists/:id', journalistController.getJournalistById);
app.post('/journalists', journalistController.createJournalist);
app.put('/journalists/:id', journalistController.updateJournalist);
app.delete('/journalists/:id', journalistController.deleteJournalist);
app.get('/journalists/:id/articles', journalistController.getArticlesByJournalist); // Get articles by journalist

// Category routes
app.get('/categories', categoryController.getAllCategories);
app.get('/categories/:id', categoryController.getCategoryById);
app.post('/categories', categoryController.createCategory);
app.put('/categories/:id', categoryController.updateCategory);
app.delete('/categories/:id', categoryController.deleteCategory);
app.get('/categories/:id/articles', categoryController.getArticlesByCategory); // Get articles by category

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
