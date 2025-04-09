import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for authentication
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }
      
      // In a real app, we would create a session here
      res.json({ 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
    }
  });

  // Questions management routes
  app.get('/api/questions', async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ أثناء جلب الأسئلة" });
    }
  });
  
  app.post('/api/questions', async (req, res) => {
    try {
      const questionData = req.body;
      const newQuestion = await storage.createQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ أثناء إضافة السؤال" });
    }
  });
  
  app.put('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const questionData = req.body;
      const updatedQuestion = await storage.updateQuestion(id, questionData);
      
      if (!updatedQuestion) {
        return res.status(404).json({ message: "لم يتم العثور على السؤال" });
      }
      
      res.json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ أثناء تحديث السؤال" });
    }
  });
  
  app.delete('/api/questions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteQuestion(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ أثناء حذف السؤال" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
