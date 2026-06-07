
DROP POLICY "Anyone can submit a quote request" ON public.quote_requests;

CREATE POLICY "Anyone can submit a valid quote request"
  ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 100
    AND char_length(trim(email)) BETWEEN 5 AND 255
    AND char_length(trim(phone)) BETWEEN 5 AND 20
    AND char_length(trim(service)) BETWEEN 2 AND 200
    AND char_length(trim(city)) BETWEEN 2 AND 100
    AND char_length(trim(details)) BETWEEN 10 AND 2000
  );
