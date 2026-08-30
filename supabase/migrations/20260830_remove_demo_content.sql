-- Remove only the temporary demo news. Related demo gallery rows are deleted by ON DELETE CASCADE.
delete from news where slug like 'demo-%';
